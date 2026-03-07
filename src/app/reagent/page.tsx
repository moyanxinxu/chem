"use client";

import React from "react";

import {
  Button,
  FloatButton,
  Popover,
  Table,
  TableProps,
  Typography,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { reagentTableColumns } from "@/constant/common";
import {
  DeleteReagentSchema,
  GetReagentsResponseSchema,
} from "@/schema/reagent.schema";

import { AddReagentPopover } from "@/components/add_reagent_popover";

import {
  deleteReagent as _deleteReagent,
  getReagents,
} from "@/api/reagent.api";

import { useCommonStore } from "@/store/common.store";

export default function ReagentPage() {
  const [rowKeys, setRowKeys] = React.useState<React.Key[]>([]);
  const { page, size, setPage } = useCommonStore();
  const queryClient = useQueryClient();

  // 获取试剂信息
  const { data: reagents } = useQuery({
    queryKey: ["getReagents", page, size],
    queryFn: async () => {
      const reagents = await getReagents({ page, size });
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
    <div className="w-full h-full p-2 bg-purple-50">
      <Table<GetReagentsResponseSchema>
        bordered
        dataSource={reagents?.items}
        pagination={{
          total: reagents?.total,
          current: reagents?.page,
          pageSize: reagents?.size,
          placement: ["topEnd", "none"],
        }}
        rowSelection={rowSelectionPros}
        onChange={(pagination) => setPage(pagination.current || 1)}
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

        <FloatButton.BackTop visibilityHeight={0} />
      </FloatButton.Group>
    </div>
  );
}
