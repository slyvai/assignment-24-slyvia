import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, message } from "antd";

export default function HomePage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

   const [messageApi, contextHolder] = message.useMessage();

    const loadings = () => {
    messageApi
       .open({
        type: 'loading',
        content: 'Action in progress..',
        duration: 2.5,
      })
      .then(() => message.success('Loading finished', 2.5))
      .then(() => message.info('Loading finished', 2.5));
  };
 


  const API_URL = "/api/students"; 
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const studentsData = res.data?.body?.data || [];
      setStudents(studentsData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  
  const handleAddStudent = async (values) => {
    const dataToSend = { ...values, class_name: values.class };
    delete dataToSend.class;

    try {
      const res = await axios.post(API_URL, dataToSend);
      const newStudent = res.data?.body?.data || dataToSend; 
       messageApi.open({
        type: 'success',
        content: 'Successfully to add student!',
        duration: 2
      })

      setStudents((prev) => [...prev, newStudent]);

      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error("Add error:", err);
      messageApi.open({
        type: 'error',
        content: 'Failed to add student',
        duration: 2
      })
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "NIS", dataIndex: "nis", key: "nis" },
    { title: "Class", dataIndex: "class_name", key: "class_name" },
    { title: "Major", dataIndex: "major", key: "major" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Student List
      </h1>

      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Add Student
      </Button>

      <Table
        columns={columns}
        dataSource={students}
        loading={loading}
        rowKey={(record) => record.id || record.nis}
      />

      <Modal
        title="Add New Student"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddStudent}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="NIS"
            name="nis"
            rules={[{ required: true, message: "Please enter NIS" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Class"
            name="class"
            rules={[{ required: true, message: "Please enter class" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Major"
            name="major"
            rules={[{ required: true, message: "Please enter major" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            {contextHolder}
            <Button type="primary" htmlType="submit" onClick = {loadings} block >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
