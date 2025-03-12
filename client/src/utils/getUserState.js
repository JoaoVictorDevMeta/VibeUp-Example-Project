const getUserState = () => {
  return JSON.parse(localStorage.getItem("user-vibe"));
};

export default getUserState;