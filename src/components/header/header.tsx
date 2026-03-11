import { HeaderPorps } from "@/schema/common";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Header = ({ lchild }: HeaderPorps) => {
  return (
    <div className="flex flex-row justify-between h-12 p-2 items-center gap-4 bg-black">
      <div>{lchild}</div>
      <div>
        <Avatar icon={<UserOutlined />} />
      </div>
    </div>
  );
};

export { Header };
