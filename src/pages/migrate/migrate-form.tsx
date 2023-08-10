import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useFdpStorage } from "../../context/fdp.context";
import Form from "../../components/form/form.component";
import { MigrateData } from "../../model/internal-messages.model";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useLocales } from "../../context/locales.context";

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
  const [sameUsername, setSameUsername] = useState<boolean>(true);
  const { intl } = useLocales();

  const onSubmitInternal = async ({
    oldUsername,
    newUsername,
    password,
  }: FormFields) => {
    try {
      setLoading(true);
      setNetworkError(false);

      const username = sameUsername ? oldUsername : newUsername;

      const usernameAvailable = await fdpClient.account.ens.isUsernameAvailable(
        username
      );

      if (!usernameAvailable) {
        return setUsernameTaken(true);
      }

      onSubmit({
        oldUsername,
        newUsername: username,
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
    if (sameUsername) {
      return null;
    }

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
        label={intl.get("OLD_USERNAME_LABEL")}
        variant="outlined"
        fullWidth
        {...register("oldUsername", { required: true })}
        disabled={loading}
        error={Boolean(errors.oldUsername)}
        helperText={errors.oldUsername && intl.get("USERNAME_REQUIRED_ERROR")}
        data-testid="old-username"
      />
      <FormControlLabel
        control={
          <Checkbox
            defaultChecked
            value={sameUsername}
            onChange={() => setSameUsername(!sameUsername)}
            disabled={loading}
          />
        }
        label={intl.get("MIGRATE_SAME_USERNAME")}
      />
      <TextField
        label={intl.get("NEW_USERNAME_LABEL")}
        variant="outlined"
        fullWidth
        {...register("newUsername", { required: !sameUsername })}
        onChange={() => setUsernameTaken(false)}
        disabled={loading || sameUsername}
        error={Boolean(
          !sameUsername && (errors.newUsername || usernameTaken || networkError)
        )}
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
        error={Boolean(errors.password)}
        helperText={errors.password && intl.get("PASSWORD_REQUIRED_ERROR")}
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
