import api from "@/helpers/api";
import Sidebar,{type RoomsType} from "@/components/sidebar";

async function getMyRooms(){
  try {
    const response = await api.get("/room/myRooms", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGM5MTE0MDY4OTRjY2Y3ZTAwODQ3NCIsImlhdCI6MTc1OTkxODM0MSwiZXhwIjoxNzYwMDkxMTQxfQ.skv3ng5et2RWqkdMyksEQ55oNiPLKGflR6nFV_gEqPs",
      },
    });
    console.log(response.data)
    const userRoomData=response.data;
    return userRoomData;
  } catch (err) {}
}
getMyRooms();
export default async function Rooms() {
    const userroomdata:RoomsType= await getMyRooms();
  return (
    <div>
      <Sidebar data={userroomdata} />
    </div>
  );
}
