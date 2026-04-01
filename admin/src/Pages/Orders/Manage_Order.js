import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Package, Tag, RefreshCw, AlertTriangle } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
  progress: "bg-indigo-100 text-indigo-800",
};

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:7500/api/v1/admin/get-all-order?page=${page}&limit=6`);
      const responseData = await response.json();
      const { data, totalPages } = responseData;
      setOrders(data);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleStatusChange = async (orderId, status) => {
    try {
      console.log("orderId, status", orderId, status);
      setLoading(true);
      const response = await fetch("http://localhost:7500/api/v1/admin/change-order-status", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await response.json();
      console.log(data);
      fetchOrders(currentPage);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        setLoading(true);
        await fetch(`http://localhost:7500/api/v1/admin/delete-order/${orderId}`, {
          method: 'DELETE',
        });
        fetchOrders(currentPage);
        alert("Order deleted successfully");
      } catch (err) {
        console.log(err);
        setError("Failed to delete order. Please try again later.");
        setLoading(false);
      }
    }
  };

  const handlePrintOrder = (order) => {
    const printWindow = window.open("", "_blank", "width=960,height=700");

    printWindow.document.open();
    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Invoice — ${order.orderId}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:        #0d0d0d;
      --ink-light:  #555;
      --line:       #e2e2e2;
      --accent:     #c8a96e;
      --accent-dim: #f5edd9;
      --bg:         #fafaf8;
      --white:      #ffffff;
      --radius:     6px;
    }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--bg);
      color: var(--ink);
      font-size: 13.5px;
      line-height: 1.6;
    }

    .page {
      max-width: 860px;
      margin: 28px auto;
      background: var(--white);
      border: 1px solid var(--line);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 32px rgba(0,0,0,0.07);
    }

    /* ── HEADER ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 32px 36px 24px;
      border-bottom: 2px solid var(--accent);
      background: var(--white);
    }

    .brand-block .word-invoice {
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      color: var(--ink);
      letter-spacing: -1px;
      line-height: 1;
    }

    .brand-block .sub {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--ink-light);
      margin-top: 4px;
    }

    .meta-block {
      text-align: right;
    }

    .meta-block .order-id {
      font-size: 15px;
      font-weight: 600;
      color: var(--ink);
    }

    .meta-block .order-date {
      font-size: 12px;
      color: var(--ink-light);
      margin-top: 3px;
    }

    .status-pill {
      display: inline-block;
      margin-top: 8px;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      background: var(--accent-dim);
      color: #7a5c1a;
    }

    /* ── BODY GRID ── */
    .body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
    }

    .panel {
      padding: 26px 36px;
      border-bottom: 1px solid var(--line);
    }

    .panel:nth-child(odd) {
      border-right: 1px solid var(--line);
    }

    .panel-full {
      grid-column: span 2;
      padding: 26px 36px;
      border-bottom: 1px solid var(--line);
    }

    .panel-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 12px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 13px;
    }

    .info-row .key {
      color: var(--ink-light);
      font-weight: 400;
    }

    .info-row .val {
      font-weight: 500;
      text-align: right;
      max-width: 55%;
    }

    /* ── OFFER / REFUND TAGS ── */
    .tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .tag-offer  { background: #e0f2fe; color: #0369a1; }
    .tag-refund { background: #fee2e2; color: #b91c1c; }

    /* ── ITEMS TABLE ── */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    thead tr {
      background: #f7f6f2;
    }

    th {
      padding: 10px 14px;
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--ink-light);
      text-align: left;
      border-bottom: 1px solid var(--line);
    }

    td {
      padding: 11px 14px;
      border-bottom: 1px solid var(--line);
      color: var(--ink);
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody tr:hover { background: #fafaf8; }

    td.amount, th.amount { text-align: right; }

    /* ── SUMMARY ── */
    .summary-wrap {
      padding: 24px 36px 28px;
      display: flex;
      justify-content: flex-end;
    }

    .summary-table {
      width: 300px;
    }

    .sum-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
      border-bottom: 1px dashed var(--line);
    }

    .sum-row:last-child { border-bottom: none; }

    .sum-row .lbl { color: var(--ink-light); }
    .sum-row .amt { font-weight: 500; }

    .sum-total {
      display: flex;
      justify-content: space-between;
      padding: 12px 0 0;
      margin-top: 8px;
      border-top: 2px solid var(--ink);
    }

    .sum-total .lbl {
      font-family: 'Playfair Display', serif;
      font-size: 17px;
    }

    .sum-total .amt {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      color: var(--ink);
    }

    /* ── FOOTER ── */
    .footer {
      background: var(--ink);
      color: rgba(255,255,255,0.55);
      padding: 16px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11.5px;
    }

    .footer strong { color: var(--accent); }

    @media print {
      body { background: #fff; }
      .page { box-shadow: none; margin: 0; border-radius: 0; border: none; }
    }
  </style>
</head>
<body>

<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="brand-block">
      <div class="word-invoice">Invoice</div>
      <div class="sub">E-Commerce Order Receipt</div>
    </div>
    <div class="meta-block">
      <div class="order-id">#${order.orderId}</div>
      <div class="order-date">${new Date(order.orderDate).toLocaleString()}</div>
      <span class="status-pill">${order.status}</span>
    </div>
  </div>

  <!-- CUSTOMER + SHIPPING side by side -->
  <div class="body">

    <div class="panel">
      <div class="panel-label">Customer</div>
      <div class="info-row">
        <span class="key">Name</span>
        <span class="val">${order.shipping?.name || order.userId?.Name}</span>
      </div>
      <div class="info-row">
        <span class="key">Email</span>
        <span class="val">${order.userId?.Email}</span>
      </div>
      <div class="info-row">
        <span class="key">Mobile</span>
        <span class="val">${order.shipping.mobileNumber}</span>
      </div>
      <div class="info-row">
        <span class="key">Payment</span>
        <span class="val">${order.paymentType}</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-label">Shipping Address</div>
      <div class="info-row">
        <span class="key">Type</span>
        <span class="val">${order.shipping.addressType}</span>
      </div>
      <div class="info-row" style="align-items:flex-start">
        <span class="key">Address</span>
        <span class="val">
          ${order.shipping.addressLine},<br>
          ${order.shipping.city}, ${order.shipping.state} — ${order.shipping.postCode}
        </span>
      </div>
    </div>

    ${order.offerId ? `
    <div class="panel">
      <div class="panel-label">Offer Applied</div>
      <span class="tag tag-offer">🏷 ${order.offerId.code} &nbsp;·&nbsp; ${order.offerId.discount}% OFF</span>
    </div>
    ` : ""}

    ${order.refundRequest ? `
    <div class="panel">
      <div class="panel-label">Refund Request</div>
      <span class="tag tag-refund">⚠ Requested</span>
      <p style="margin-top:10px;font-size:12.5px;color:#555">
        <strong>Reason:</strong> ${order.refundReason || "N/A"}
      </p>
    </div>
    ` : ""}

  </div>

  <!-- ITEMS -->
  <div class="panel-full" style="padding:0">
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Size</th>
          <th>Qty</th>
          <th class="amount">Unit Price</th>
          <th class="amount">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>${item.quantity}</td>
            <td class="amount">₹${item.price.toFixed(2)}</td>
            <td class="amount">₹${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>

  <!-- SUMMARY -->
  <div class="summary-wrap">
    <div class="summary-table">

      <div class="sum-row">
        <span class="lbl">Subtotal</span>
        <span class="amt">₹${order.totalAmount.toFixed(2)}</span>
      </div>

      <div class="sum-row">
        <span class="lbl">Delivery Fee</span>
        <span class="amt">₹${order.shippingAmount.toFixed(2)}</span>
      </div>

      <div class="sum-row">
        <span class="lbl">VAT</span>
        <span class="amt">₹${order?.vatAmount}</span>
      </div>

      ${order.paymentType === "COD" ? `
      <div class="sum-row">
        <span class="lbl">COD Fee</span>
        <span class="amt" style="color:#b91c1c">−₹${order.codFeeAmount.toFixed(2)}</span>
      </div>
      ` : ""}

      ${order.offerId ? `
      <div class="sum-row">
        <span class="lbl">Discount</span>
        <span class="amt" style="color:#15803d">−₹${(order.totalAmount - order.payAmt).toFixed(2)}</span>
      </div>
      ` : ""}

      <div class="sum-total">
        <span class="lbl">Total Paid</span>
        <span class="amt">₹${order.payAmt - (order.paymentType === "COD" ? order.codFeeAmount : 0)}</span>
      </div>

    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <span>Thank you for shopping with us <strong>❤</strong></span>
    <span>System generated invoice &nbsp;·&nbsp; ${order.orderId}</span>
  </div>

</div>

<script>
  window.onload = function () {
    setTimeout(() => {
      window.print();
      window.onafterprint = () => window.close();
    }, 500);
  };
</script>
</body>
</html>
  `);

    printWindow.document.close();
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-red-500">
          <AlertCircle className="w-8 h-8" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <Package className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        </header>

        <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Offer</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Refund</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Payment</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900 font-medium">{order.orderId}</td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <div className="flex flex-col">
                      {order.offerId && Object.keys(order.offerId).length > 0 ? (
                        <>
                          <span className="text-gray-500 line-through text-xs">₹{order.totalAmount.toFixed(2)}</span>
                          <span className="text-green-600 font-medium">₹{order.payAmt.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-medium">₹{order.payAmt.toFixed(2)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {order.offerId && Object.keys(order.offerId).length > 0 ? (
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-500" />
                        <div className="flex flex-col">
                          <span className="text-green-600 font-medium text-xs">{order.offerId.code}</span>
                          <span className="text-gray-500 text-xs">{order.offerId.discount}% off</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No offer</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {order.refundRequest ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <RefreshCw className="w-4 h-4 text-red-500" />
                          <span className="text-red-600 font-medium text-xs">Requested</span>
                        </div>
                        {order.refundReason && (
                          <div className="group relative">
                            <AlertTriangle className="w-4 h-4 text-amber-500 cursor-help" />
                            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              <div className="font-medium mb-1">Refund Reason:</div>
                              <div>{order.refundReason}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No refund</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{order.paymentType}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {
                      new Date(order.orderDate).toLocaleDateString()
                    }
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePrintOrder(order)}
                          className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                          Print
                        </button>
                        <button
                          onClick={() => window.location.href = `/order/${order?.orderId}`}
                          className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          View
                        </button>
                      </div>
                      <select
                        className="px-2 py-1 text-xs bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === "delete") {
                            handleDeleteOrder(order._id);
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select Action
                        </option>
                        <option value="delete" className="text-red-600">
                          Delete Order
                        </option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageOrder;