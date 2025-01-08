import React, { useEffect, useState } from "react";
import { Row, Col, Card, message, Spin } from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { orderAPI } from "../../../services/apis/Order";

export default function OrderOverview() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Gọi API để lấy dữ liệu đơn hàng
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getAllOrdersInfo(); // Gọi API
      setOrders(response);
    } catch (error) {
      message.error("Không thể tải dữ liệu đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Xử lý dữ liệu tổng quan
  const totalSummary = {
    totalOrders: orders.length,
    totalPeople: orders.reduce((acc, order) => acc + (order.num_people || 0), 0),
    totalRevenue: orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0),
  };

  // Xử lý dữ liệu theo ngày cho biểu đồ
  const groupedByDate = orders.reduce((acc, order) => {
    const date = order.time.split("T")[0]; // Lấy ngày (yyyy-MM-dd)
    if (!acc[date]) {
      acc[date] = { date, numOrders: 0, totalRevenue: 0 };
    }
    acc[date].numOrders += 1;
    acc[date].totalRevenue += order.totalAmount || 0;
    return acc;
  }, {});

  const chartData = Object.values(groupedByDate);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tổng Quan Đơn Hàng</h1>

      {/* Thông tin tổng quan */}
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Tổng Số Đơn Hàng" bordered>
            <Spin spinning={loading}>
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                {totalSummary.totalOrders}
              </p>
            </Spin>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tổng Số Người Đặt" bordered>
            <Spin spinning={loading}>
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                {totalSummary.totalPeople}
              </p>
            </Spin>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tổng Doanh Thu" bordered>
            <Spin spinning={loading}>
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                {totalSummary.totalRevenue.toLocaleString()} VND
              </p>
            </Spin>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ đường doanh thu và biểu đồ cột số đơn hàng */}
      <Row gutter={16} className="mt-6">
        {/* Biểu đồ doanh thu bên trái */}
        <Col span={12}>
          <Card title="Doanh Thu Theo Ngày" bordered>
            <Spin spinning={loading}>
              <LineChart
                width={500}
                height={300}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#82ca9d"
                  name="Doanh Thu"
                />
              </LineChart>
            </Spin>
          </Card>
        </Col>

        {/* Biểu đồ số đơn hàng bên phải */}
        <Col span={12}>
          <Card title="Số Lượng Đơn Hàng Theo Ngày" bordered>
            <Spin spinning={loading}>
              <BarChart
                width={500}
                height={300}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="numOrders" fill="#8884d8" name="Số Đơn Hàng" />
              </BarChart>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
