interface EmailTemplateProps {
  name?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name
}) => (
  <div>
    <h1>Welcome, User!</h1>
  </div>
);
