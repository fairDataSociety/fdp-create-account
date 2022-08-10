import React, { useState } from "react";
import intl from "react-intl-universal";
import { useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import Form from "../../components/form/form.component";
import { RegisterData } from "../../model/internal-messages.model";
import { useFdpStorage } from "../../context/fdp.context";
import { isPasswordValid } from "../../utils/ens.utils";

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
  const { fdpClient } = useFdpStorage();
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (password: string): string | null => {
    if (!isPasswordValid(password)) {
      return intl.get("PASSWORD_TOO_SHORT");
    }

    return null;
  };

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
      setUsernameError(null);

      const usernameAvailable = await fdpClient.account.ens.isUsernameAvailable(
        username
      );

      if (!usernameAvailable) {
        return setUsernameError("USERNAME_NOT_AVAILABLE");
      }

      onSubmit({
        username,
        password,
        privateKey: "",
      });
    } catch (error) {
      if ((error as Error).message?.includes("Username is not valid.")) {
        setUsernameError("INVALID_USERNAME");
      } else {
        setUsernameError("CANNOT_CHECK_USERNAME");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getUsernameError = () => {
    if (errors.username) {
      return intl.get("USERNAME_REQUIRED_ERROR");
    }

    if (usernameError) {
      return intl.get(usernameError as string);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmitInternal)}>
      <TextField
        label={intl.get("USERNAME")}
        variant="outlined"
        fullWidth
        {...register("username", { required: true })}
        onChange={() => setUsernameError(null)}
        disabled={loading}
        error={Boolean(errors.username || usernameError)}
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
