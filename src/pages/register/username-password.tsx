import React, { useState } from "react";
import intl from "react-intl-universal";
import { useForm } from "react-hook-form";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import Form from "../../components/form/form.component";
import { RegisterData } from "../../model/internal-messages.model";
import { useFdpStorage } from "../../context/fdp.context";
import { isPasswordValid } from "../../utils/ens.utils";
import Disclaimer from "../../components/disclaimer/disclaimer.component";
import { getMainNetwork, useNetworks } from "../../context/network.context";
import { Network } from "../../model/network.model";
import { useAccount } from "../../context/account.context";

export interface UsernamePasswordProps {
  onSubmit: (data: RegisterData) => void;
}

interface FormFields {
  username: string;
  password: string;
  networkLabel: string;
}

const UsernamePassword = ({ onSubmit }: UsernamePasswordProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const { updateFdpClient } = useFdpStorage();
  const { inviteKey } = useAccount();
  const { networks, currentNetwork } = useNetworks();
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
    networkLabel,
  }: FormFields) => {
    try {
      const passError = validatePassword(password);

      if (passError) {
        return setPasswordError(passError);
      }

      setLoading(true);
      setUsernameError(null);
      setPasswordError(null);

      const network = networks.find(
        ({ label }) => label === networkLabel
      ) as Network;

      let currentFdpClient = updateFdpClient(network);

      const usernameAvailable =
        await currentFdpClient.account.ens.isUsernameAvailable(username);

      if (!usernameAvailable) {
        return setUsernameError(intl.get("USERNAME_NOT_AVAILABLE"));
      }

      onSubmit({
        username,
        password,
        privateKey: "",
        network,
      });
    } catch (error) {
      const { message } = error as Error;

      if (message) {
        if (message.includes("Username is not valid.")) {
          setUsernameError(intl.get("INVALID_USERNAME"));
        } else {
          setUsernameError(message);
        }
      } else {
        setUsernameError(intl.get("CANNOT_CHECK_USERNAME"));
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
      return usernameError;
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmitInternal)}>
      <Disclaimer />
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
      {inviteKey ? (
        <input
          type="hidden"
          value={getMainNetwork().label}
          {...register("networkLabel", { required: true })}
        />
      ) : (
        <Select
          defaultValue={currentNetwork.label}
          variant="outlined"
          fullWidth
          disabled={loading}
          data-testid="network"
          {...register("networkLabel", { required: true })}
          sx={{
            marginTop: "20px",
          }}
        >
          {networks.map(({ label }) => (
            <MenuItem key={label} value={label}>
              {label}
            </MenuItem>
          ))}
        </Select>
      )}
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
