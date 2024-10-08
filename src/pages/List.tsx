import React, { useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import TableThree from '../components/Tables/TableThree';

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: 'A', age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  { id: 10, lastName: 'Baratheon', firstName: 'Robert', age: 40 },
  { id: 11, lastName: 'Tyrell', firstName: 'Margaery', age: 24 },
  { id: 12, lastName: 'Greyjoy', firstName: 'Theon', age: 30 },
  { id: 13, lastName: 'Bolton', firstName: 'Ramsay', age: 27 },
  { id: 14, lastName: 'Martell', firstName: 'Oberyn', age: 38 },
  { id: 15, lastName: 'Baelish', firstName: 'Petyr', age: 42 },
];

const PAGE_SIZE = 12;

export default function List() {
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastRow = currentPage * PAGE_SIZE;
  const indexOfFirstRow = indexOfLastRow - PAGE_SIZE;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleView = (id: number) => {
    alert(`View details for user ID: ${id}`);
  };

  const handleEdit = (id: number) => {
    alert(`Edit user ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(`Are you sure you want to delete user ID: ${id}?`);
    if (confirmed) {
      alert(`User ID: ${id} deleted`);
    }
  };

  return (
    <TableThree>
      
    </TableThree>
    // <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
    //   <h2 className="text-3xl font-bold mb-6">User List</h2>
    //   <div className="overflow-x-auto w-full">
    //     <table className="min-w-full bg-white border border-gray-300">
    //       <thead>
    //         <tr className="bg-blue-500 text-white">
    //           <th className="py-4 px-4 border-b text-black dark:text-white">ID</th>
    //           <th className="py-4 px-4 border-b text-black dark:text-white">First Name</th>
    //           <th className="py-4 px-4 border-b text-black dark:text-white">Last Name</th>
    //           <th className="py-4 px-4 border-b text-black dark:text-white">Age</th>
    //           <th className="py-4 px-4 border-b text-black dark:text-white">Full Name</th>
    //           <th className="py-4 px-4 border-b text-black dark:text-white">Actions</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {currentRows.map((row) => (
    //           <tr key={row.id} className="text-center bg-white dark:bg-boxdark">
    //             <td className="py-4 px-4 border-b text-black dark:text-white">{row.id}</td>
    //             <td className="py-2 px-4 border-b text-black dark:text-white">{row.firstName}</td>
    //             <td className="py-2 px-4 border-b text-black dark:text-white">{row.lastName}</td>
    //             <td className="py-2 px-4 border-b text-black dark:text-white">{row.age !== null ? row.age : 'N/A'}</td>
    //             <td className="py-2 px-4 border-b text-black dark:text-white">{`${row.firstName} ${row.lastName}`}</td>
    //             <td className="py-2 px-4 border-b text-black dark:text-white">
    //             <div className="flex justify-center space-x-2">
    //                 <button
    //                   className="px-1.5 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 flex items-center"
    //                   onClick={() => handleView(row.id)}
    //                 >
    //                   <PreviewOutlinedIcon className="                        text-sm" /> View
    //                 </button>
    //                 <button
    //                   className="px-1.5 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 flex items-center"
    //                   onClick={() => handleEdit(row.id)}
    //                 >
    //                   <EditOutlinedIcon className="text-sm" /> Edit
    //                 </button>
    //                 <button
    //                   className="px-1.5 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 flex items-center"
    //                   onClick={() => handleDelete(row.id)}
    //                 >
    //                   <DeleteOutlineOutlinedIcon className="text-sm" /> Delete
    //                 </button>
    //               </div>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>

    //   <div className="flex justify-center items-center mt-4">
    //     <button
    //       onClick={() => paginate(currentPage - 1)}
    //       disabled={currentPage === 1}
    //       className={`px-4 py-2 mx-1 text-sm bg-blue-500 text-white rounded ${
    //         currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'
    //       }`}
    //     >
    //       Previous
    //     </button>
    //     {Array.from({ length: totalPages }, (_, index) => (
    //       <button
    //         key={index + 1}
    //         onClick={() => paginate(index + 1)}
    //         className={`px-4 py-2 mx-1 text-sm rounded ${
    //           currentPage === index + 1
    //             ? 'bg-blue-500 text-white'
    //             : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    //         }`}
    //       >
    //         {index + 1}
    //       </button>
    //     ))}
    //     <button
    //       onClick={() => paginate(currentPage + 1)}
    //       disabled={currentPage === totalPages}
    //       className={`px-4 py-2 mx-1 text-sm bg-blue-500 text-white rounded ${
    //         currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'
    //       }`}
    //     >
    //       Next
    //     </button>
    //   </div>
    // </div>
  );
}
