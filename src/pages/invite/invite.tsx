import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RouteCodes from "../../routes/route-codes";
import { useAccount } from "../../context/account.context";

const Invite = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const { setInviteKey } = useAccount();

  const extractInviteKey = (): string => {
    const match = (key || "").match(/I_[a-f0-9]{64}/g);

    if (!match || match[0] !== key) {
      throw new Error("Invalid invite key");
    }

    return `0x${(key as string).substring(2)}`;
  };

  const onLoad = () => {
    try {
      const inviteKey = extractInviteKey();

      setInviteKey(inviteKey);
    } catch (error) {
      console.warn("Invalid invite key");
    } finally {
      navigate(RouteCodes.register);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(onLoad, []);

  return null;
};

export default Invite;
