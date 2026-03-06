import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Divider, Button, Space, Select } from "antd";

import {
  ReloadOutlined,
  CloudUploadOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { addReagent as _addReagent } from "@/api/reagent.api";
import { toast } from "sonner";
import { useCommonStore } from "@/store/common.store";
import { pageDataSchema } from "@/schema/common";
import { getReagentsResponseSchema } from "@/schema/reagent.schema";

const units = [
  { label: "ml", value: "ml" },
  { label: "g", value: "g" },
  { label: "kg", value: "kg" },
];

const AddReagentPopover = () => {
  const [chemLab, setChemLab] = useState<string>("");
  const [chemName, setChemName] = useState<string>("");
  const [reagentNum, setReagentNum] = useState<string>("");
  const [unit, setUnit] = useState("ml");

  const { page, size, total, setPage } = useCommonStore();
  const queryClient = useQueryClient();

  const { mutate: addReagent } = useMutation({
    mutationKey: ["addReagent"],
    mutationFn: async () => {
      if (!!chemName && !!chemLab && !!reagentNum) {
        await _addReagent({
          chemLab,
          chemName,
          reagentNum: Number(reagentNum),
        });
      } else {
        throw new Error("请填写实验室、化学名称和试剂数量");
      }
    },

    onSuccess: async () => {
      const reagents = queryClient.getQueryData<
        pageDataSchema<getReagentsResponseSchema>
      >(["getReagents", page, size]);

      const length = reagents?.items.length || 0;

      if (length + 1 > size) {
        setPage(Math.ceil((total + 1) / size));
      }

      await queryClient.invalidateQueries({
        queryKey: ["getReagents", page, size],
      });

      toast.success(`成功在${chemLab}中添加了${reagentNum}的${chemName}`);
    },
    onError: () => {
      if (!chemName || !chemLab || !reagentNum) {
        toast.warning("请填写实验室、化学名称和试剂数量");
      } else {
        toast.error(`在${chemLab}中添加${reagentNum}的${chemName}时出错了`);
      }
    },
  });

  const handleClearState = () => {
    setChemLab("");
    setChemName("");
    setReagentNum("");
    setUnit("ml");
  };

  return (
    <Form name="add-reagent-form">
      <Divider />

      <Form.Item label="实验室">
        <Input
          value={chemLab}
          onChange={(e) => {
            setChemLab(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="化学名称">
        <Input
          value={chemName}
          onChange={(e) => {
            setChemName(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="试剂数量">
        <Space>
          <Input
            value={reagentNum}
            onChange={(e) => {
              setReagentNum(e.target.value);
            }}
          />
          <Select
            defaultValue={unit}
            value={unit}
            options={units}
            onChange={(item) => setUnit(item)}
          />
        </Space>
      </Form.Item>

      <Form.Item className="flex items-center justify-center">
        <Space.Compact>
          <Button type="primary" onClick={() => addReagent()}>
            <CloudUploadOutlined />
            提交
          </Button>

          <Button onClick={() => handleClearState()}>
            <ReloadOutlined />
            重置
          </Button>

          <Button>
            <CloseOutlined />
            取消
          </Button>
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

export { AddReagentPopover };
