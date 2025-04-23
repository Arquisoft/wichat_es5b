// UpdatePassword.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdatePassword from "./UpdatePassword";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Mockeamos axios y jwtDecode
jest.mock("axios");
jest.mock("jwt-decode");

describe("UpdatePassword component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
    jwtDecode.mockReturnValue({ userId: "1234" }); // mockea el userId
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should render and open dialog on menu item click", () => {
    render(<UpdatePassword />);

    const menuItem = screen.getByText(/Editar contraseña/i);
    fireEvent.click(menuItem);

    expect(screen.getByText(/Edite su contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña actual/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nueva contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar contraseña/i)).toBeInTheDocument();
  });

  it("should call axios and show success snackbar", async () => {
    axios.post.mockResolvedValueOnce({});

    let oldPassword1 = "OldPassword1";
    let newPassword1 = "NewPassword1";

    render(<UpdatePassword />);
    fireEvent.click(screen.getByText(/Editar contraseña/i));

    fireEvent.change(screen.getByLabelText(/Contraseña actual/i), {
      target: { value: oldPassword1 },
    });
    fireEvent.change(screen.getByLabelText(/Nueva contraseña/i), {
      target: { value: newPassword1 },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), {
      target: { value: newPassword1 },
    });

    fireEvent.click(screen.getByRole("button", { name: /Actualizar contraseña/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/updatepassword", {
        userId: "1234",
        oldPassword: "OldPassword1",
        newPassword: "NewPassword1",
        confirmPassword: "NewPassword1",
      });

      expect(screen.getByText(/Contraseña actualizada correctamente/i)).toBeInTheDocument();
    });
  });

  it("should display error message on API failure", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: "Contraseña actual incorrecta" } },
    });

    let wrongPassword2 = "WrongOld1";
    let newPassword2 = "NewPassword1";

    render(<UpdatePassword />);
    fireEvent.click(screen.getByText(/Editar contraseña/i));

    fireEvent.change(screen.getByLabelText(/Contraseña actual/i), {
      target: { value: wrongPassword2 },
    });
    fireEvent.change(screen.getByLabelText(/Nueva contraseña/i), {
      target: { value: newPassword2 },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), {
      target: { value: newPassword2 },
    });

    fireEvent.click(screen.getByRole("button", { name: /Actualizar contraseña/i }));

    await waitFor(() => {
      expect(screen.getByText(/Contraseña actual incorrecta/i)).toBeInTheDocument();
    });
  });
});
