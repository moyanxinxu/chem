"use client";

import { useState } from "react";

import {
  Button,
  FloatButton,
  Pagination,
  Popover,
  Space,
  Table,
  TableProps,
  Typography,
} from "antd";

import {
  MoreOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { reagentTableColumns } from "@/constant/common";
import {
  DeleteReagentSchema,
  GetReagentsResponseSchema,
} from "@/schema/reagent.schema";

import { AddReagentPopover } from "@/components/add_reagent_popover";
import { FilterReagentPopover } from "@/components/filter_reagent_popover";

import {
  deleteReagent as _deleteReagent,
  getReagents,
} from "@/api/reagent.api";

import { useCommonStore } from "@/stores/common.store";
import { useFilterStore } from "@/stores/filter.store";

export default function ReagentPage() {
  const [rowKeys, setRowKeys] = useState<React.Key[]>([]);
  const { page, size, setPage } = useCommonStore();
  const { chemLab, chemCas, chemName, cabinet, place, clearFilters } =
    useFilterStore();
  const queryClient = useQueryClient();

  // 获取试剂信息
  const { data: reagents } = useQuery({
    queryKey: [
      "getReagents",
      page,
      size,
      chemLab,
      chemCas,
      chemName,
      cabinet,
      place,
    ],
    queryFn: async () => {
      const reagents = await getReagents({
        page,
        size,
        chemLab,
        chemCas,
        chemName,
        cabinet,
        place,
      });
      return reagents;
    },

    select: (data) => ({
      ...data,
      items: data.items.map((item) => ({
        ...item,
        key: item.id,
      })),
    }),
  });

  const total = reagents?.total || 0;

  // 删除试剂信息
  const { mutate: deleteReagent } = useMutation({
    mutationKey: ["deleteReagent"],

    mutationFn: async (id: string) => {
      const query = new DeleteReagentSchema(id);
      await _deleteReagent(query);
    },

    onSuccess: async () => {
      const _total = total - 1;
      const endPage = Math.ceil(_total / size);
      if (endPage < page) {
        setPage(Math.max(endPage, 1));
      }

      await queryClient.invalidateQueries({
        queryKey: ["getReagents", page, size],
      });

      toast.success("删除试剂信息成功");
    },
  });

  const rowSelectionPros: TableProps<GetReagentsResponseSchema>["rowSelection"] =
    {
      type: "checkbox",
      // onChange: (keys: React.Key[], rows: GetReagentsResponseSchema[]) => {

      onChange: (keys: React.Key[]) => setRowKeys(keys),
    };

  return (
    <div className="w-full h-full p-2 bg-purple-50 gap-2 flex flex-col">
      <Typography.Title level={2}>试剂信息</Typography.Title>
      <div className="flex items-center justify-between">
        <Space>
          <FilterReagentPopover />
          <Button icon={<ReloadOutlined />} onClick={() => clearFilters()}>
            清空筛选
          </Button>
        </Space>

        <Pagination
          total={reagents?.total}
          current={reagents?.page}
          pageSize={reagents?.size}
          onChange={(page, _) => setPage(page || 1)}
        />
      </div>

      <Table<GetReagentsResponseSchema>
        bordered
        size="small"
        dataSource={reagents?.items}
        pagination={false}
        rowSelection={rowSelectionPros}
      >
        {reagentTableColumns.map((col) => (
          <Table.Column key={col.dataIndex} {...col} />
        ))}

        <Table.Column
          title="操作"
          key="action"
          render={(_, record: GetReagentsResponseSchema) => (
            <Button type="link" danger onClick={() => deleteReagent(record.id)}>
              删除
            </Button>
          )}
        />
      </Table>

      <FloatButton.Group shape="square">
        {/* <FloatButton icon={<DeleteOutlined />} /> */}

        <Popover
          placement="left"
          content={<AddReagentPopover />}
          title={<Typography.Title level={5}>添加试剂</Typography.Title>}
          trigger="click"
        >
          <FloatButton icon={<PlusCircleOutlined />} />
        </Popover>

        <FloatButton icon={<MoreOutlined />} />
      </FloatButton.Group>
    </div>
  );
}
