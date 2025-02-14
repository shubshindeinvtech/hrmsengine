const Help = () => {
  const pdfUrl = "/docs/HRMS_Portal_User_Guide.pdf";

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <a
        className="bg-blue-500 text-white p-2 rounded"
        onClick={() => window.open(pdfUrl, "_blank")}
      >
        Open PDF
      </a>
    </div>
  );
};

export default Help;
