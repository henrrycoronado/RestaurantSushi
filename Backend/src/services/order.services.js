import { prisma } from '../prisma/client.js';

export const getAllOrders = async () => {
  return await prisma.orders.findMany({
    include: {
      users: { select: { id: true, name: true } },
      ordersdetail: {
        include: { products: true }
      }
    }
  });
};

export const getOrderById = async (id) => {
  return await prisma.orders.findUnique({
    where: { id },
    include: {
      users: { select: { id: true, name: true } },
      ordersdetail: {
        include: { products: true }
      }
    }
  });
};

export const createOrder = async (orderData) => {
  const { user_id, details } = orderData;

  return await prisma.$transaction(async (tx) => {
    let totalOrderPrice = 0;
    const detailsWithSubtotal = await Promise.all(details.map(async (detail) => {
      const product = await tx.products.findUnique({ where: { id: detail.product_id } });
      if (!product) {
        throw new Error(`Producto con ID ${detail.product_id} no encontrado.`);
      }
      const subtotal = product.price * detail.amount;
      totalOrderPrice += subtotal;
      return {
        product_id: detail.product_id,
        amount: detail.amount,
        subtotal: subtotal,
      };
    }));

    const order = await tx.orders.create({
      data: {
        user_id: user_id,
      },
    });

    await tx.ordersdetail.createMany({
      data: detailsWithSubtotal.map(detail => ({
        ...detail,
        order_id: order.id,
      })),
    });

    return tx.orders.findUnique({
      where: { id: order.id },
      include: { ordersdetail: { include: { products: true } } },
    });
  });
};

export const updateOrderState = async (id, state) => {
    return await prisma.orders.update({
        where: { id },
        data: { state },
    });
};