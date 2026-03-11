"use client";

import { Form, Flex, Card, Input, Button } from "antd";
import {
  LockOutlined,
  UserOutlined,
  ArrowRightOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { getToken } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setAuthStore } = useAuthStore();

  const router = useRouter();
  const canLogin = username !== "" && password !== "";

  const { mutate: handleClickLogInButton } = useMutation({
    mutationKey: ["getToken", username],
    onMutate: async () => setIsLoading(true),
    mutationFn: async () => {
      const response = await getToken({ username, password });

      if (!response.accessToken) {
        throw new Error("登录失败！");
      } else {
        const { accessToken } = response;
        localStorage.setItem("access_token", accessToken);
        // localStorage.setItem("username", username)
        setAuthStore({ accessToken });
      }
    },
    onSuccess: async () => {
      router.push("/");
      toast.success("登录成功！");
    },
    onError: async () => toast.error("登录失败！"),
    onSettled: async () => setIsLoading(false),
  });

  const handleClickSignInButton = () => {
    toast.info("联系【田健翔】同学的微信号：wanwuxiyu");
  };

  return (
    <Card title="登陆">
      <Form labelCol={{ span: 4 }} style={{ minWidth: 480 }} autoComplete="off">
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名！" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input
            prefix={<LockOutlined />}
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Flex justify="right" align="center">
            <Button type="link" onClick={() => handleClickSignInButton()}>
              忘记密码或注册新账号
            </Button>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            block
            disabled={!canLogin}
            onClick={() => handleClickLogInButton()}
          >
            登陆
            {isLoading ? <LoadingOutlined /> : <ArrowRightOutlined />}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
