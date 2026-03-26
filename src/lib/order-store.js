import { promises as fs } from "node:fs";
import path from "node:path";

const ordersFile = path.join(process.cwd(), "src", "data", "orders.json");

async function readOrders() {
  try {
    const raw = await fs.readFile(ordersFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeOrders(orders) {
  await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
}

export async function listOrders() {
  const orders = await readOrders();
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getOrderById(orderId) {
  const orders = await readOrders();
  return orders.find((order) => order.id === orderId) ?? null;
}

export async function createOrder(order) {
  const orders = await readOrders();
  orders.push(order);
  await writeOrders(orders);
  return order;
}

export async function updateOrder(orderId, updater) {
  const orders = await readOrders();
  const index = orders.findIndex((order) => order.id === orderId);

  if (index === -1) {
    return null;
  }

  const nextValue = typeof updater === "function" ? updater(orders[index]) : updater;
  orders[index] = nextValue;
  await writeOrders(orders);
  return orders[index];
}

export async function getOrderStats() {
  const orders = await listOrders();
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const monthKey = now.toISOString().slice(0, 7);

  const todayOrders = orders.filter((order) => order.createdAt.slice(0, 10) === todayKey);
  const monthOrders = orders.filter((order) => order.createdAt.slice(0, 7) === monthKey);
  const projectedRevenue = orders.reduce((sum, order) => sum + order.budget * order.quantity, 0);

  return {
    totalOrders: orders.length,
    todayOrders: todayOrders.length,
    monthlyOrders: monthOrders.length,
    projectedRevenue,
  };
}
