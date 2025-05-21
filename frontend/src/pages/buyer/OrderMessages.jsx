import { useParams } from "react-router-dom";
import MessageContainer from "../../components/Messages/MessageContainer";

function OrderMessages() {
  const { orderId } = useParams();

  

  return (
    <div>
      <MessageContainer orderId={orderId} />
    </div>
  );
}

export default OrderMessages; 