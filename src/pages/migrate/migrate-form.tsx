import React, { useState } from "react";
import intl from "react-intl-universal";
import { useForm } from "react-hook-form";
import { useFdpStorage } from "../../context/fdp.context";
import Form from "../../components/form/form.component";
import { MigrateData } from "../../model/internal-messages.model";
import { Button, TextField } from "@mui/material";

export interface MigrateFormProps {
  onSubmit: (data: MigrateData) => void;
}

interface FormFields {
  oldUsername: string;
  newUsername: string;
  password: string;
}

const MigrateForm = ({ onSubmit }: MigrateFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const { fdpClient } = useFdpStorage();
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameTaken, setUsernameTaken] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (password: string): string | null => {
    // TODO Might not needed for migration
    // if (!isPasswordValid(password)) {
    //   return intl.get("PASSWORD_TOO_SHORT");
    // }

    return null;
  };

  const onSubmitInternal = async ({
    oldUsername,
    newUsername,
    password,
  }: FormFields) => {
    try {
      const passError = validatePassword(password);

      if (passError) {
        return setPasswordError(passError);
      }

      setLoading(true);
      setNetworkError(false);

      const usernameAvailable = await fdpClient.account.ens.isUsernameAvailable(
        oldUsername
      );

      if (!usernameAvailable) {
        return setUsernameTaken(true);
      }

      onSubmit({
        oldUsername,
        newUsername,
        password,
      });
    } catch (error) {
      setNetworkError(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getUsernameError = () => {
    if (errors.oldUsername) {
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
        {...register("oldUsername", { required: true })}
        disabled={loading}
        error={Boolean(errors.oldUsername || usernameTaken || networkError)}
        helperText={getUsernameError()}
        data-testid="username"
      />
      {/* TODO There is no option to provide new username for now */}
      {/* <TextField
        label={intl.get("NEW_USERNAME_LABEL")}
        variant="outlined"
        fullWidth
        {...register("newUsername", { required: true })}
        onChange={() => setUsernameTaken(false)}
        disabled={loading}
        error={Boolean(errors.newUsername || usernameTaken || networkError)}
        helperText={getUsernameError()}
        data-testid="username"
      /> */}
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
        {intl.get("MIGRATE")}
      </Button>
    </Form>
  );
};

export default MigrateForm;
