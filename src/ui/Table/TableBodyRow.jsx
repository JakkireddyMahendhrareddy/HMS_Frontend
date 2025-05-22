import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
const TableBodyRow = ({ roomInfo, index, editRoom, handleDeleteRoomClick }) => {
  const { number, type, beds, availableBeds, rent } = roomInfo;

  return (
    <tr className="group relative hover:bg-blue-50 transition-colors even:bg-gray-50 cursor-pointer">
      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-gray-700">
        {number}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {beds}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {availableBeds}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {rent}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {availableBeds > 0 ? (
          <span className="bg-green-100 text-green-800 px-1.5 py-1 rounded-sm">
            Available
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 px-1.5 py-1 rounded-sm">
            Occupied
          </span>
        )}
      </td>

      {/* 🧊 Floating buttons */}
      <td className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-2 px-2 py-2 z-10">
        <button onClick={() => editRoom(number)} className="text-gray-700">
          <FaEdit size={18} />
        </button>
        <button
          onClick={() => handleDeleteRoomClick(number)}
          className="text-gray-700"
        >
          <AiFillDelete size={18} />
        </button>
      </td>
    </tr>
  );
};

export default TableBodyRow;
