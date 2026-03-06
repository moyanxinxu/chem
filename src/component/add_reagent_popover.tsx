import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  Input,
  Divider,
  Button,
  Space,
  Select,
  AutoComplete,
  DatePicker,
  type DatePickerProps,
} from "antd";
import { toast } from "sonner";

import {
  ReloadOutlined,
  CloudUploadOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { addReagent as _addReagent } from "@/api/reagent.api";
import { getChemInfo } from "@/api/msds.api";
import { useCommonStore } from "@/store/common.store";
import { PageDataSchema } from "@/schema/common";
import { getReagentsResponseSchema } from "@/schema/reagent.schema";

import { isCasValid } from "@/lib/utils";

const units = [
  { label: "ml", value: "ml" },
  { label: "L", value: "l" },
  { label: "g", value: "g" },
  { label: "kg", value: "kg" },
  { label: "略", value: "略" },
];

const labs = [
  { label: "214试剂仓库", value: "214试剂仓库" },
  { label: "110实验室自留", value: "110实验室自留" },
  { label: "111实验室自留", value: "111实验室自留" },
  { label: "119实验室自留", value: "119实验室自留" },
  { label: "210实验室自留", value: "210实验室自留" },
  { label: "221实验室自留", value: "221实验室自留" },
  { label: "223实验室自留", value: "223实验室自留" },
  { label: "225实验室自留", value: "225实验室自留" },
];

const AddReagentPopover = () => {
  const [chemLab, setChemLab] = useState<string>("");
  const [chemName, setChemName] = useState<string>("");
  const [chemCas, setChemCas] = useState<string>("");
  const [cabinet, setCabinet] = useState<string>("");
  const [msdsUrl, setMsdsUrl] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [producer, setProducer] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [mfgDate, setMfgDate] = useState<string>("");
  const [reagentNum, setReagentNum] = useState<string>("");
  const [other, setOther] = useState<string>("");

  const [unit, setUnit] = useState<"ml" | "L" | "g" | "kg" | "略">("ml");
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );

  const [casValid, setCasValid] = useState<boolean>(false);

  const { page, size, total, setPage } = useCommonStore();
  const queryClient = useQueryClient();

  const canAddChem = !!chemName && !!chemLab && !!reagentNum && !!stock;

  const { data: chemInfo } = useQuery({
    queryKey: ["getChemInfo", chemCas],
    queryFn: async () => {
      const { records } = await getChemInfo(chemCas);

      if (records.length !== 0) {
        const record = records[0];

        const options = record.chemAlias.split(";").map((item) => ({
          label: item,
          value: item,
        }));

        setChemName(record.chemName);
        setOptions([
          { label: record.chemName, value: record.chemName },
          ...options,
        ]);
        setMsdsUrl(record.safetyFileUrl);

        toast.success("获取到化学品名称" + record.chemName + `(${chemCas})`);
        return record;
      } else {
        return [];
      }
    },
    enabled: casValid,
  });

  const { mutate: addReagent } = useMutation({
    mutationKey: ["addReagent"],
    mutationFn: async () => {
      if (canAddChem) {
        await _addReagent({
          chemLab,
          chemName,
          chemCas,
          place,
          unit,
          cabinet,
          stock: Number(stock),
          reagentNum: Number(reagentNum),
          msdsUrl,
          producer,
          mfgDate,
          other,
        });
      } else {
        throw new Error("请填写实验室、化学名称和试剂数量");
      }
    },

    onSuccess: async () => {
      const reagents = queryClient.getQueryData<
        PageDataSchema<getReagentsResponseSchema>
      >(["getReagents", page, size]);

      const length = reagents?.items.length || 0;

      if (length + 1 > size) {
        setPage(Math.ceil((total + 1) / size));
      }

      await queryClient.invalidateQueries({
        queryKey: ["getReagents", page, size],
      });

      setChemCas("");
      setReagentNum("");
      setCasValid(false);
      setChemName("");

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
    setChemCas("");
    setReagentNum("");
    setUnit("ml");
  };

  const handleChangeChemCas = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChemCas(e.target.value);
    setCasValid(isCasValid(e.target.value));
  };

  const handleChangeMfgDate: DatePickerProps["onChange"] = (
    date,
    dateString,
  ) => {
    setMfgDate(`${dateString}`);
  };

  return (
    <Form name="add-reagent-form">
      <Divider />

      <Form.Item label="*实验室">
        <Select
          value={chemLab}
          onChange={(item) => setChemLab(item)}
          options={labs}
        />
      </Form.Item>

      <Form.Item label="*试剂柜">
        <Input value={cabinet} onChange={(e) => setCabinet(e.target.value)} />
      </Form.Item>

      <Form.Item label="具体方位">
        <Input value={place} onChange={(e) => setPlace(e.target.value)} />
      </Form.Item>

      <Form.Item label="CAS号">
        {casValid ? (
          <Input
            status="success"
            prefix={<CheckOutlined />}
            value={chemCas}
            onChange={handleChangeChemCas}
          />
        ) : (
          <Input
            status="error"
            prefix={<CloseOutlined />}
            value={chemCas}
            onChange={handleChangeChemCas}
          />
        )}
      </Form.Item>

      <Form.Item label="msds信息地址">
        <Input value={msdsUrl} onChange={(e) => setMsdsUrl(e.target.value)} />
      </Form.Item>

      <Form.Item label="*试剂名称">
        <AutoComplete
          value={chemName}
          onChange={(value) => {
            setChemName(value);
          }}
          options={options}
        />
      </Form.Item>

      <Form.Item label="*试剂存量">
        <Space.Compact>
          <Input
            value={stock}
            onChange={(e) => {
              setStock(e.target.value);
            }}
          />
          <Select
            defaultValue={unit}
            value={unit}
            options={units}
            onChange={(item) => setUnit(item)}
          />
        </Space.Compact>
      </Form.Item>

      <Form.Item label="*数量">
        <Input
          value={reagentNum}
          onChange={(e) => setReagentNum(e.target.value)}
        />
      </Form.Item>

      <Form.Item label="生产厂商">
        <Input value={producer} onChange={(e) => setProducer(e.target.value)} />
      </Form.Item>

      <Form.Item label="生产日期">
        <DatePicker onChange={handleChangeMfgDate} />
      </Form.Item>

      <Form.Item className="flex items-center justify-center">
        <Space.Compact>
          <Button
            type="primary"
            onClick={() => addReagent()}
            disabled={!canAddChem}
          >
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
