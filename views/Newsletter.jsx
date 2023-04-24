const { View } = require('grandjs');

const Styles = {
  body: {
    backgroundColor: '#ccc',
    margin: '0px',
    padding: '0px',
  },
  section_one: {
    padding: '30px',
    margin: 0,
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    fontSize: '0px',
    padding: '0px',
    fontFamily: "'Roboto',sans-serif",
  },
  header: {
    textAlign: 'center',
    height: '50px',
    padding: '0px',
    margin: '0px',
  },
  headerline: {
    backgroundColor: '#E6FFF7',
    textAlign: 'center',
    fontSize: '20px',
    color: '#333',
    lineHeight: '40px',
    fontWeight: '400px',
    margin: '0px',
  },
  img: {
    display: 'inline',
    width: '25%',
    verticalAlign: 'middle',
  },
  paragraph: {
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: '300',
    color: '#666',
    width: 'calc(75% - 40px)',
    padding: '0 20px',
    margin: '0',
    lineHeight: 1.4,
    verticalAlign: 'middle',
  },
  btn: {
    display: 'block',
    backgroundColor: '#29F0C2',
    fontSize: '18px',
    color: 'white',
    padding: 0,
    margin: '30px auto 0',
    border: 0,
    borderRadius: '5px',
    lineHeight: '40px',
    height: '40px',
    width: '200px',
    textAlign: 'center',
  },
};
const Newsletter = ({ token }) => {
  return (
    <div>
      <body style={Styles.body}>
        <div style={Styles.container}>
          <div style={Styles.header}>
            <h1>Your daily News is here!</h1>
          </div>
          <div>
            <h2 style={Styles.headerline}>Welcome</h2>
            <div class="section_one" style={Styles.section_one}>
              <img src={item.img} style={Styles.img} />
              <div class="paragraph" style={Styles.paragraph}>
                This is reset password link which allows you to reset new
                password to log in ToolBox website successfully
              </div>
              <a href="${process.env.FRONTEND_ADDRESS}resetpassword/${token}">
                ${process.env.FRONTEND_ADDRESS}resetpassword/${token}"
                class="btn" style={Styles.btn}&gt; Read Article
              </a>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
};

module.exports = Newsletter;
