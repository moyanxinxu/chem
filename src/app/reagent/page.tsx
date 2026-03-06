"use client";

import {
  Table,
  Popover,
  FloatButton,
  Typography,
  TableProps,
  Button,
} from "antd";

import { PlusCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getReagentsResponseSchema } from "@/schema/reagent.schema";
import { AddReagentPopover } from "@/component/add_reagent_popover";
import {
  getReagents,
  deleteReagent as _deleteReagent,
} from "@/api/reagent.api";
import { useCommonStore } from "@/store/common.store";
import React from "react";

const tableColumns = [
  { title: "实验室", dataIndex: "chemLab", key: "chemLab" },
  {
    title: "化学名称",
    dataIndex: "chemName",
    key: "chemName",
  },
  {
    title: "CAS",
    dataIndex: "chemCas",
    key: "chemCas",
  },
  {
    title: "批号",
    dataIndex: "batchNum",
    key: "batchNum",
  },
  {
    title: "现有库存",
    dataIndex: "existingStock",
    key: "existingStock",
  },
  {
    title: "生产厂商",
    dataIndex: "producer",
    key: "producer",
  },
  {
    title: "存放位置",
    dataIndex: "place",
    key: "place",
  },
  {
    title: "试剂数量",
    dataIndex: "reagentNum",
    key: "reagentNum",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
  },
];

export default function ReagentPage() {
  const [rowKeys, setRowKeys] = React.useState<React.Key[]>([]);
  const { page, size, total, setPage, setTotal } = useCommonStore();
  const queryClient = useQueryClient();

  const { data: reagents } = useQuery({
    queryKey: ["getReagents", page, size],
    queryFn: async () => {
      const reagents = await getReagents({ page, size });
      setTotal(reagents.total);
      return reagents;
    },
  });

  const { mutate: deleteReagent } = useMutation({
    mutationKey: ["deleteReagent"],
    mutationFn: async (id: string) => await _deleteReagent(id),

    onSuccess: async () => {
      const real_total = total - 1;
      const endPage = Math.ceil(real_total / size);
      if (endPage < page) {
        setPage(Math.max(endPage, 1));
      }

      await queryClient.invalidateQueries({
        queryKey: ["getReagents", page, size],
      });

      toast.success("删除试剂成功");
    },
  });

  const rowSelectionPros: TableProps<getReagentsResponseSchema>["rowSelection"] =
    {
      type: "checkbox",
      // onChange: (keys: React.Key[], rows: getReagentsResponseSchema[]) => {

      onChange: (keys: React.Key[]) => {
        setRowKeys(keys);
      },
    };

  return (
    <div className="w-full h-full p-2 bg-purple-50">
      <Table<getReagentsResponseSchema>
        bordered
        dataSource={reagents?.items.map((item) => ({ ...item, key: item.id }))}
        pagination={{
          total: reagents?.total,
          current: reagents?.page,
          pageSize: reagents?.size,
          placement: ["topEnd", "none"],
        }}
        rowSelection={rowSelectionPros}
        onChange={(pagination) => {
          setPage(pagination.current || 1);
        }}
      >
        {tableColumns.map((col) => (
          <Table.Column
            key={col.key}
            title={col.title}
            dataIndex={col.dataIndex}
          />
        ))}

        <Table.Column
          title="操作"
          key="action"
          render={(_, record: getReagentsResponseSchema) => (
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
