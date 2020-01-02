import { renderHook, act } from "@testing-library/react-hooks";
import { useLocalStorage } from "../localStorage";

global.localStorage.__proto__ = {
  getItem: jest.fn(),
  setItem: jest.fn()
};

describe("useLocalStorage", () => {
  it("gets values from localstorage", () => {
    global.localStorage.getItem.mockReturnValueOnce('"joe"');

    const { result } = renderHook(() => useLocalStorage("name"));
    const [get] = result.current;

    expect(get).toBe("joe");
    expect(global.localStorage.getItem).toHaveBeenCalledWith("name");
  });

  it("sets values to localstorage", () => {
    const { result } = renderHook(() => useLocalStorage("name"));
    const [, set] = result.current;

    act(() => set("test"));

    expect(global.localStorage.setItem).toHaveBeenCalledWith("name", '"test"');
  });

  it("returns default value in case of error", () => {
    const { result } = renderHook(() => useLocalStorage("name", "jane"));
    const [get, set] = result.current;

    act(() => set("joe"));

    expect(get).toBe("jane");
  });

  it("stores and retrieves complex JSON objects", () => {
    global.localStorage.getItem.mockReturnValueOnce('{"name":"joe"}');
    const { result } = renderHook(() => useLocalStorage("settings", {}));
    const [get, set] = result.current;

    act(() => set({ name: "joe" }));

    expect(get).toEqual({ name: "joe" });
  });
});
