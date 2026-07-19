import { useRef, useContext, useState, useEffect } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDelete, MdLock, MdPerson, MdLogout } from "react-icons/md";
import { BiCalendarAlt, BiTimeFive } from "react-icons/bi";
import { TodoItemsContext } from "../store/todo-items-store";

// Helper formatting logic to convert ISO timestamps or raw inputs to clean "14 Jul, 2026" and time variants
const formatDateString = (rawDateString) => {
  if (!rawDateString) return { dateStr: "No Date Set", timeStr: "--:--" };
  
  let cleanedInput = rawDateString;
  if (typeof cleanedInput === "string" && cleanedInput.endsWith("Z")) {
    cleanedInput = cleanedInput.slice(0, -1);
  }

  const date = new Date(cleanedInput);
  if (isNaN(date.getTime())) {
    // If it's already a string, check if it needs formatting or if it already looks correct
    let fallbackStr = String(rawDateString);
    // If it's a string like "14 Jul 2026" without a comma, add the comma
    if (/^\d+\s+[A-Za-z]+\s+\d+$/.test(fallbackStr)) {
      const parts = fallbackStr.split(/\s+/);
      fallbackStr = `${parts[0]} ${parts[1]}, ${parts[2]}`;
    }
    return { 
      dateStr: fallbackStr, 
      timeStr: "--:--" 
    };
  }

  // Formats cleanly to "14 Jul, 2026" with the comma included
  const dateStr = `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}, ${date.getFullYear()}`;
  const timeStr = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { dateStr, timeStr };
};

function AdminTodoManager() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  const adminUsernameInput = useRef();
  const adminPasswordInput = useRef();

  const { todoItems, addAdminItem, deleteAdminItem } = useContext(TodoItemsContext);
  const todoNameElement = useRef();
  const dueDateElement = useRef();

  useEffect(() => {
    const activeAdminSession = localStorage.getItem("batch_admin_session");
    if (activeAdminSession === "true") {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const enteredUser = adminUsernameInput.current.value;
    const enteredPass = adminPasswordInput.current.value;

    let backendBaseUrl = import.meta.env.VITE_API_URL || "";
    if (!backendBaseUrl && window.location.hostname.includes("github.dev")) {
      backendBaseUrl = `https://${window.location.hostname.replace("-5173.", "-3000.")}`;
    }

    const TARGET_ENDPOINT = `${backendBaseUrl}/api/admin/todo/login`;

    try {
      const response = await fetch(TARGET_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: enteredUser, password: enteredPass }),
        credentials: "include", // Maintained for cross-domain cookie passing
      });

      const responseText = await response.text();
      let data = {};
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Non-JSON error response detected:", responseText);
        setLoginError("Server returned an invalid response. Verify routing structure.");
        return;
      }

      if (response.ok && data.success) {
        localStorage.setItem("batch_admin_session", "true");
        setIsAdminLoggedIn(true);
        setLoginError("");
      } else {
        setLoginError(data.message || "Access Denied: Invalid Admin Credentials.");
      }
    } catch (error) {
      console.error("Authentication server communication down:", error);
      setLoginError("Server communication failure. Please verify backend state.");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("batch_admin_session");
    setIsAdminLoggedIn(false);
  };

  const handleAddButtonClicked = (event) => {
    event.preventDefault();
    const todoName = todoNameElement.current.value;
    const dueDate = dueDateElement.current.value;
    if (!todoName || !dueDate) return;

    addAdminItem(todoName, dueDate);
    todoNameElement.current.value = "";
    dueDateElement.current.value = "";
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 font-sans p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-red-50 text-red-600 rounded-full mb-3">
              <MdLock size={28} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Systems IT Panel Gate</h1>
            <p className="text-xs text-gray-500 mt-1">Access restricted to batch administrators</p>
          </div>

          {loginError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-xl text-xs font-semibold text-red-700 text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Admin User ID</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <MdPerson size={18} />
                </span>
                <input
                  type="text"
                  ref={adminUsernameInput}
                  placeholder="Enter authorized ID"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Security Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <MdLock size={18} />
                </span>
                <input
                  type="password"
                  ref={adminPasswordInput}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all text-sm shadow-sm hover:shadow"
            >
              Verify Credentials
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans max-w-5xl mx-auto py-4">
      <div className="mx-5 md:mx-8 mb-6 flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="text-left">
          <h1 className="text-lg font-bold text-gray-900">Batch Task Control</h1>
          <p className="text-xs text-gray-500 mt-0.5">Broadcasting tasks to 500 Batch Students</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAdminLogout}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-xl hover:bg-red-50 border border-gray-200 hover:border-red-100 transition-colors"
          >
            <MdLogout size={16} />
            <span>Exit Panel</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-5 mb-4 md:mb-0 md:px-8">
        <form
          onSubmit={handleAddButtonClicked}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 md:p-5 md:mb-8 bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
          <input
            type="text"
            ref={todoNameElement}
            placeholder="Broadcast Task Name..."
            className="w-full md:w-[1000px] px-4 py-3 border border-gray-400 rounded-xl text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <div className="flex flex-1 gap-3">
            <input
              type="datetime-local"
              ref={dueDateElement}
              className="flex-1 md:w-[150px] h-12 px-3 border border-gray-400 rounded-xl transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="submit"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-600 text-white text-3xl cursor-pointer transition-all hover:bg-green-700 hover:scale-105 active:scale-95"
            >
              <IoAddCircleOutline />
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col items-center w-full">
        {!todoItems || todoItems.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-base">
            No active batch tasks broadcasted.
          </div>
        ) : (
          todoItems.map((item) => {
            // Evaluates and formats date layers cleanly for every object entry parsed
            const { dateStr, timeStr } = formatDateString(item.dueDate || item.date);

            return (
              <div key={item.id || item.name} className="w-full my-2 px-5 sm:px-8">
                <div className="w-full px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 ease-in-out shadow-sm">
                  <div className="flex items-center w-full sm:w-auto flex-1 min-w-0 mb-4 sm:mb-0">
                    <div className="text-left text-base sm:text-lg font-medium pr-6 text-gray-800 break-words overflow-hidden flex-1">
                      {item.name}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto md:gap-4 shrink-0 pt-3 sm:pt-0 border-t border-gray-100 sm:border-t-0">
                    <div className="flex flex-row items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50/60 text-blue-700 rounded-full text-sm md:text-base font-medium border border-blue-100/50">
                        <BiCalendarAlt className="text-base shrink-0 text-blue-500" />
                        <span>{dateStr}</span>
                      </div>
                      
                      {timeStr !== "--:--" && (
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50/60 text-amber-700 rounded-full text-sm md:text-base font-medium border border-amber-100/50">
                          <BiTimeFive className="text-base shrink-0 text-amber-500" />
                          <span>{timeStr}</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteAdminItem(item)}
                      disabled={item.isSaving || false}
                      aria-label="Delete task"
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-100 hover:border-red-100 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm hover:shadow"
                    >
                      <MdDelete className="text-lg sm:text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminTodoManager;