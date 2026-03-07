import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AutoComplete,
  Button,
  Divider,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Tag,
} from "antd";

import {
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";

import { addReagent as _addReagent } from "@/api/reagent.api";
import { isCasValid, getLsAllCases } from "@/lib/utils";
import { getChemInfo } from "@/api/msds.api";
import {
  GetReagentsResponseSchema,
  ReagentSchema,
} from "@/schema/reagent.schema";
import { PageSchema, LabelValueSchema } from "@/schema/common";
import { labs, units, producers } from "@/constant/common";
import { useCommonStore } from "@/store/common.store";

const AddReagentPopover = () => {
  const [chem, setChem] = useState<ReagentSchema>({
    chemLab: "",
    chemName: "",
    chemCas: "",
    place: "",
    cabinet: "",
    stock: "",
    reagentNum: "",
    unit: units[0],
    producer: "",
    mfgDate: "",
    msdsUrl: "",
    other: "",
  });

  const [labInfo, setLabInfo] = useState<(typeof labs)[0]>({
    lab: "",
    cabinets: [],
  });

  const handleChange = (key: keyof ReagentSchema, value: string) => {
    setChem((prev) => ({ ...prev, [key]: value }));
  };

  const [options, setOptions] = useState<LabelValueSchema[]>([]);
  const [casValid, setCasValid] = useState<boolean>(false);

  const { page, size, setPage } = useCommonStore();
  const queryClient = useQueryClient();

  const canAddChem =
    !!chem.chemName && !!chem.chemLab && !!chem.reagentNum && !!chem.stock;

  // 获取化学品信息
  const { data: chemInfo } = useQuery({
    queryKey: ["getChemInfo", chem.chemCas],
    queryFn: async () => {
      const { records } = await getChemInfo(chem.chemCas);

      if (records.length !== 0) {
        const record = records[0];

        const options = getLsAllCases(record.chemAlias.split(";"));

        handleChange("chemName", record.chemName);
        handleChange("msdsUrl", record.safetyFileId);

        setOptions([
          { label: record.chemName, value: record.chemName },
          ...options,
        ]);

        toast.success(
          "获取化学品名称" + record.chemName + "(" + chem.chemCas + ")",
        );
        return record;
      } else {
        return [];
      }
    },

    enabled: casValid,
  });

  // 添加试剂信息
  const { mutate: addReagent } = useMutation({
    mutationKey: ["addReagent"],

    // 添加试剂信息
    mutationFn: async () => await _addReagent(chem),

    // 添加成功时
    onSuccess: async () => {
      const reagents = queryClient.getQueryData<
        PageSchema<GetReagentsResponseSchema>
      >(["getReagents", page, size]);

      const length = reagents?.items.length || 0;
      const total = reagents?.total || 0;

      if (length + 1 > size) {
        setPage(Math.ceil((total + 1) / size));
      }

      await queryClient.invalidateQueries({
        queryKey: ["getReagents", page, size],
      });

      // setChemCas("");
      // setReagentNum("");
      // setCasValid(false);
      // setChemName("");

      toast.success(
        `成功在${chem.chemLab}中添加了${chem.reagentNum}的${chem.chemName}`,
      );
    },

    //添加出错时
    onError: () =>
      toast.error(
        `在${chem.chemLab}中添加${chem.reagentNum}的${chem.chemName}时出错了`,
      ),
  });

  const handleClearState = () => {
    handleChange("chemName", "");
    handleChange("chemLab", "");
    handleChange("chemCas", "");
    handleChange("place", "");
    handleChange("cabinet", "");
    handleChange("stock", "");
    handleChange("reagentNum", "");
    handleChange("unit", units[0]);
    handleChange("producer", "");
    handleChange("mfgDate", "");
    handleChange("msdsUrl", "");
    handleChange("other", "");

    setCasValid(false);
  };

  const { mutate: handleChangeChemCas } = useMutation({
    mutationKey: ["handleChangeChemCas", chem.chemCas],
    mutationFn: async (chemCas: string) => {
      handleChange("chemCas", chemCas);

      const casValid = isCasValid(chemCas);

      setCasValid(casValid);
    },
  });

  const { mutate: handleChangeMfgDate } = useMutation({
    mutationKey: ["handleChangeMfgDate", chem.mfgDate],
    mutationFn: async (dataString: string | null) => {
      if (dataString) {
        handleChange("mfgDate", dataString);
      } else {
        handleChange("mfgDate", "");
      }
    },
  });

  const requiredTag = (
    label: React.ReactNode,
    { required }: { required: boolean },
  ) => (
    <>
      {label}
      {required ? <Tag color="error">必填</Tag> : null}
    </>
  );

  const handleChangeChemLab = (chemLab: string) => {
    handleChange("chemLab", chemLab);
    const labItem = labs.find((item) => item.lab === chemLab);

    setLabInfo(labItem ?? { lab: "", cabinets: [] });
  };

  const getPlacesByCabinet = () => {
    const cabinetInfo =
      labInfo.cabinets.find((item) => item.name === chem.cabinet)?.places ?? [];
    return getLsAllCases(cabinetInfo);
  };

  const getProducersOptions = () => {
    const options = producers.filter((item) => item.startsWith(chem.producer));

    return getLsAllCases(options) ?? [];
  };

  return (
    <Form name="add-reagent-form" requiredMark={requiredTag}>
      <Divider />

      <Form.Item required label="实验室">
        <Select
          value={chem.chemLab}
          onChange={(chemLab) => handleChangeChemLab(chemLab)}
          options={getLsAllCases(labs.map((item) => item.lab))}
        />
      </Form.Item>

      <Form.Item required label="试剂柜">
        <AutoComplete
          value={chem.cabinet}
          onChange={(cabinet) => handleChange("cabinet", cabinet)}
          options={getLsAllCases(labInfo.cabinets.map((item) => item.name))}
        />
      </Form.Item>

      <Form.Item label="具体方位">
        <AutoComplete
          value={chem.place}
          onChange={(place) => handleChange("place", place)}
          options={getPlacesByCabinet()}
        />
      </Form.Item>

      <Form.Item label="CAS号">
        {casValid ? (
          <Input
            status="success"
            prefix={<CheckOutlined />}
            value={chem.chemCas}
            onChange={(e) => handleChangeChemCas(e.target.value)}
          />
        ) : (
          <Input
            status="error"
            prefix={<CloseOutlined />}
            value={chem.chemCas}
            onChange={(e) => handleChangeChemCas(e.target.value)}
          />
        )}
      </Form.Item>

      <Form.Item label="msds信息地址">
        <Input
          value={chem.msdsUrl}
          onChange={(e) => handleChange("msdsUrl", e.target.value)}
        />
      </Form.Item>

      <Form.Item required label="试剂名称">
        <AutoComplete
          value={chem.chemName}
          onChange={(value) => handleChange("chemName", value)}
          options={options}
        />
      </Form.Item>

      <Form.Item required label="试剂存量">
        <Space.Compact>
          <Input
            value={chem.stock}
            onChange={(e) => {
              handleChange("stock", e.target.value);
            }}
          />
          <Select
            defaultValue={chem.unit}
            value={chem.unit}
            options={getLsAllCases(units)}
            onChange={(item) => handleChange("unit", item)}
          />
        </Space.Compact>
      </Form.Item>

      <Form.Item required label="数量">
        <Input
          value={chem.reagentNum}
          onChange={(e) => handleChange("reagentNum", e.target.value)}
        />
      </Form.Item>

      <Form.Item label="生产厂商">
        <AutoComplete
          value={chem.producer}
          onChange={(procuder) => handleChange("producer", procuder)}
          options={getProducersOptions()}
        />
      </Form.Item>

      <Form.Item label="生产日期">
        <DatePicker
          onChange={(_, dataString) => handleChangeMfgDate(dataString)}
        />
      </Form.Item>

      <Form.Item label="入库时间">
        <DatePicker
          onChange={(_, dataString) => handleChangeMfgDate(dataString)}
        />
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
