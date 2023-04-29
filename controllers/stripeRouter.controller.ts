import User from '../models/users.model';

const getStringToAmoumt = (amount) => {
  let value = {
    string: '',
    count: 0,
  };
  switch (amount) {
    case 9900:
      value.string = 'Starter';
      value.count = 10;
      break;
    case 19900:
      value.string = 'Growth';
      value.count = 100;
      break;
    case 39900:
      value.string = 'Business';
      value.count = 500;
      break;
    case 59900:
      value.string = 'Enterprise';
      value.count = 0;
      break;

    default:
      break;
  }
  return value;
};

export const payment = async (req, res) => {
  try {
    console.log('stresssssss', req.body);
    if (req.body.type === 'charge.succeeded') {
      const amount = req.body.data.object.amount;
      const email = req.body.data.object.billing_details.email;
      console.log('Stripe Email = ', email);
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(404)
          .json({ message: 'Please check your email to bill' });
      } else {
        const billingValue = getStringToAmoumt(amount);
        user.billing.value =
          billingValue.string === 'Enterprise'
            ? billingValue.count
            : user.billing.value + billingValue.count;
        user.billing.state = billingValue.string;
        await user.save();
      }
    }
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
