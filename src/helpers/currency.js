export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

export function getDiscountedPrice(game) {
  const price = Number(game?.preco ?? 0);
  const discount = Number(game?.desconto ?? 0);

  if (!discount) return price;
  return price - price * (discount / 100);
}