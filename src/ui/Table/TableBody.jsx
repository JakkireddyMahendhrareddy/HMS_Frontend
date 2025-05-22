import TableBodyRow from "./TableBodyRow";

const TableBody = ({ bodyData, editRoom, handleDeleteRoomClick }) => {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {bodyData.map((room, index) => (
        <TableBodyRow
          key={room.number}
          roomInfo={room}
          index={room.number}
          editRoom={editRoom}
          handleDeleteRoomClick={handleDeleteRoomClick}
        />
      ))}
    </tbody>
  );
};

export default TableBody;
