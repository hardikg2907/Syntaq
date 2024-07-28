const RegisterPage = ({ params }: { params: { id: number } }) => {
  return (
    <div>
      {/* <RegisterForm id={params.id} /> */}
      {params.id}
    </div>
  );
};

export default RegisterPage;
