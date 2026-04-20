import React, { useState } from "react";
import AppSidebar from "../components/Side-bar";
import { LucideSearch } from "lucide-react";

export default function ProductTable() {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const data = [
    { id: 1, name: 'Apple MacBook Pro 17"', color: "Silver", category: "Laptop", price: 2999 },
    { id: 2, name: "Microsoft Surface Pro", color: "White", category: "Laptop PC", price: 1999 },
    { id: 3, name: "Magic Mouse 2", color: "Black", category: "Accessories", price: 99 },
    { id: 4, name: "Apple Watch", color: "Silver", category: "Accessories", price: 179 },
    { id: 5, name: "iPad", color: "Gold", category: "Tablet", price: 699 },
    { id: 6, name: 'Apple iMac 27"', color: "Silver", category: "PC Desktop", price: 3999 },
  ];

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((item) => item.id));
    }
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 shrink-0">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="container mx-auto mt-2 p-4 lg:p-8 xl:max-w-7xl">
        
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          
          {/* Header */}
          <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200">
            
            {/* Search */}
            <div className="relative w-full max-w-sm">
              <span className="absolute left-3 top-2.5 text-gray-400"><LucideSearch size={24} /></span>
              <input
                type="text"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg"
              >
                Filter ⌄
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {["Color", "Category", "Price"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setDropdownOpen(false)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === data.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Product</th>
                  <th className="px-6 py-3 text-left font-semibold">Color</th>
                  <th className="px-6 py-3 text-left font-semibold">Category</th>
                  <th className="px-6 py-3 text-left font-semibold">Price</th>
                  <th className="px-6 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => toggleRow(item.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4">{item.color}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4 font-medium">
                      ${item.price}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-600 hover:text-black hover:underline">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}