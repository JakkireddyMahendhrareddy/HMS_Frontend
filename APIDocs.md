backendUrl : http://localhost:5001

# auth

- /api/auth/register - User registration
  (email,password,name,mobileNumber)

- api/auth/login - User login (expects email,password)

  -Request body:
  data format
  {
  name,email,mobileNumber,password
  }

# Profile

- /api/user/view-profile - to get profile data
  returns(name,email,mobileNumber,avatarurl)

- api/user/edit-profile(Email can't be edited)

- api/user/delete-profile - to entirely close his account from our website

# Hostel

- api/hostel/add - to add hostel data
  {
  "name":"",
  "category":"", [accepts only two values men,women]
  "maxCapacity":,(number)
  "totalRooms":,(number)
  }

- api/hostel/view
  get all data
  {
  "name":"",
  "category":"", [accepts only two values men,women]
  "maxCapacity":,(number)
  "totalRooms":,(number)
  }

- api/hostel/edit

- api/hostel/remove

(Confirm once sure to delete hostel)

# Room

-api/hostel/room/add - Adds a single room

-api/hostel/room/get - it returns an array of rooms available in hostel,if no room is there [] array returns

-api/hostel/room/edit/:roomId (Room number cannot be changed, room data can be changed)

-api/hostel/room/remove/:roomId
