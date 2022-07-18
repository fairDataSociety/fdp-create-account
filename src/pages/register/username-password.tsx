import React, { useState } from "react";
import intl from "react-intl-universal";
import { useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import Form from "../../components/form/form.component";
import { RegisterData } from "../../model/internal-messages.model";
import { useFdpStorage } from "../../context/fdp.context";

export interface UsernamePasswordProps {
  onSubmit: (data: RegisterData) => void;
}

interface FormFields {
  username: string;
  password: string;
  networkId: string;
}

const UsernamePassword = ({ onSubmit }: UsernamePasswordProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameTaken, setUsernameTaken] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (password: string): string | null => {
    if (!password || password.length < 8) {
      return intl.get("PASSWORD_TOO_SHORT");
    }

    return null;

    // TODO check if password contains lowercase and uppercase letters
  };
  // using FDP Storage
  const { fdpClient } = useFdpStorage();

  const onSubmitInternal = async ({
    username,
    password,
    networkId,
  }: FormFields) => {
    try {
      const passError = validatePassword(password);

      if (passError) {
        return setPasswordError(passError);
      }

      setLoading(true);
      setNetworkError(false);

      const usernameAvailable = await fdpClient.account.ens.isUsernameAvailable(username);

      if (!usernameAvailable) {
        return setUsernameTaken(true);
      }

      onSubmit({
        username,
        password,
        privateKey: "",
      });
    } catch (error) {
      setNetworkError(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getUsernameError = () => {
    if (errors.username) {
      return intl.get("USERNAME_REQUIRED_ERROR");
    }

    if (usernameTaken) {
      return intl.get("USERNAME_NOT_AVAILABLE");
    }

    if (networkError) {
      return intl.get("CANNOT_CHECK_USERNAME");
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmitInternal)}>
      <TextField
        label={intl.get("USERNAME")}
        variant="outlined"
        fullWidth
        {...register("username", { required: true })}
        onChange={() => setUsernameTaken(false)}
        disabled={loading}
        error={Boolean(errors.username || usernameTaken || networkError)}
        helperText={getUsernameError()}
        data-testid="username"
      />
      <TextField
        label={intl.get("PASSWORD")}
        variant="outlined"
        type="password"
        fullWidth
        {...register("password", { required: true })}
        disabled={loading}
        error={Boolean(errors.password || passwordError)}
        helperText={
          passwordError ||
          (errors.password && intl.get("PASSWORD_REQUIRED_ERROR"))
        }
        data-testid="password"
      />
      <Button
        color="primary"
        variant="contained"
        type="submit"
        size="large"
        disabled={loading}
        data-testid="submit"
        sx={{
          marginTop: "50px",
        }}
      >
        {intl.get("REGISTER")}
      </Button>
    </Form>
  );
};

export default UsernamePassword;
