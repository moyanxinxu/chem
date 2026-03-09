import {
  AutoComplete,
  Button,
  Divider,
  Form,
  Input,
  InputProps,
  Popover,
  Select,
  Space,
} from "antd";
import {
  FunnelPlotOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { labs } from "@/constant/common";
import { useState } from "react";
import { getLsAllCases, isCasValid } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getChemInfo } from "@/api/msds.api";
import { useFilterStore } from "@/stores/filter.store";

const chemCasStatus: Record<"success" | "error", InputProps> = {
  success: { status: "success", prefix: <CheckOutlined /> },
  error: { status: "error", prefix: <CloseOutlined /> },
};

const FilterForm = () => {
  const {
    chemLab,
    chemName,
    chemCas,
    cabinet,
    place,
    setChemLab,
    setChemName,
    setChemCas,
    setCabinet,
    setPlace,
    clearFilters,
  } = useFilterStore();

  const [chemNameOptions, setChemNameOptions] = useState<string[]>([]);
  const [cabinetOptions, setCabinetOptions] = useState<string[]>([]);
  const [placeOptions, setPlaceOptions] = useState<string[]>([]);

  const casValid = isCasValid(chemCas);

  const { data: chemInfo } = useQuery({
    queryKey: ["getChemInfo", chemCas],
    queryFn: async () => {
      const { records } = await getChemInfo(chemCas);

      if (records.length !== 0) {
        const record = records[0];

        const chemNameOptions = [record.chemName, record.chemAlias]
          .filter(Boolean)
          .join(";")
          .split(";");

        setChemName(record.chemName);
        setChemNameOptions(chemNameOptions);

        return record;
      } else {
        return [];
      }
    },

    enabled: casValid,
  });

  const handleChangeChemLab = (chemLab: string) => {
    setChemLab(chemLab);

    const labItem = labs.find((item) => item.lab === chemLab);

    setCabinetOptions(labItem?.cabinets.map((cabinet) => cabinet.name) ?? []);
  };

  const handleChangeCabinet = (cabinet: string) => {
    setCabinet(cabinet);

    const labItem = labs.find((item) => item.lab === chemLab);
    const placeOptions = labItem?.cabinets.find(
      (item) => item.name === cabinet,
    );

    console.log(placeOptions);
    setPlaceOptions(placeOptions?.places ?? []);
  };

  return (
    <Form>
      <Divider />

      <Form.Item label="实验室">
        <Select
          value={chemLab}
          options={getLsAllCases(labs.map((labInfo) => labInfo.lab))}
          onChange={(chemLab) => handleChangeChemLab(chemLab)}
        />
      </Form.Item>

      <Form.Item label="CAS">
        <Input
          {...(casValid ? chemCasStatus.success : chemCasStatus.error)}
          value={chemCas}
          onChange={(e) => setChemCas(e.target.value)}
        />
      </Form.Item>

      <Form.Item label="化学名称">
        <AutoComplete
          value={chemName}
          options={getLsAllCases(chemNameOptions)}
          onChange={(chemName) => setChemName(chemName)}
        />
      </Form.Item>

      <Form.Item label="试剂柜">
        <Select
          value={cabinet}
          options={getLsAllCases(cabinetOptions)}
          onChange={(cabinet) => handleChangeCabinet(cabinet)}
        />
      </Form.Item>

      <Form.Item label="具体方位">
        <Select
          value={place}
          options={getLsAllCases(placeOptions)}
          onChange={(place) => setPlace(place)}
        />
      </Form.Item>

      <Form.Item>
        <Space className="w-full justify-end">
          <Button onClick={() => clearFilters()}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

const FilterReagentPopover = () => {
  return (
    <Popover
      title="筛选数据"
      content={<FilterForm />}
      placement="rightTop"
      trigger="click"
    >
      <Button icon={<FunnelPlotOutlined />}>筛选数据</Button>
    </Popover>
  );
};

export { FilterReagentPopover };
