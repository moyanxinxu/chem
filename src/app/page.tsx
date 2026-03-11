import Link from "next/link";
import { apps } from "@/constant/common";

import { Card, Col, Row } from "antd";
import { ArrowRightFromLine } from "lucide-react";
import { IconLinkProps } from "@/schema/common";

import { Header } from "@/components/header/header";

const IconLink = ({ icon, href }: IconLinkProps) => {
  return <Link href={href}>{icon}</Link>;
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <div className="flex-1 bg-purple-50 p-4">
        <Row gutter={16}>
          {apps.map((app) => (
            <Col key={app.href} span={8}>
              <Card
                title={app.title}
                extra={
                  <IconLink
                    icon={<ArrowRightFromLine size={16} />}
                    href={app.href}
                  />
                }
              >
                {app.desc}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
