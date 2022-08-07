export const produceLogToKafka = async (pathname) => {
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  await fetch(`${process.env.apiGatewayUrl}/kafka`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ip: data.ip,
      path: pathname,
    }),
  });
};