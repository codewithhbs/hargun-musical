import { useState } from "react";
import { Tag } from "lucide-react"

export default function RecentOrders({ orders }) {
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 5; // Number of items per page

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the orders array to get items for the current page
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Offer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentOrders.map((order, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 underline dark:text-white"><a href={`/order/${order.orderId}`}>{order.orderId}</a></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{order.shipping?.name || order.userId?.Name}</td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                    dangerouslySetInnerHTML={{
                      __html: order.items?.map((item) => item.name).join('<br />')
                    }}
                  ></td>

                  <td className="px-4 py-2 text-sm text-gray-900">
                    <div className="flex flex-col">
                      {order.offerId ? (
                        <>
                          <span className="text-gray-500 line-through text-xs">₹{order.totalAmount.toFixed(2)}</span>
                          <span className="text-green-600 font-medium">₹{order.payAmt.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-medium text-gray-500">₹{order.payAmt.toFixed(2)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {order.offerId ? (
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
                  <td className="px-4 py-2 text-sm text-gray-500">{order.paymentType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' :
                      order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400' :
                        order.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400' :
                          'bg-gray-100 text-gray-800 bg-[#81190B]/50 dark:text-gray-400'
                      }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
