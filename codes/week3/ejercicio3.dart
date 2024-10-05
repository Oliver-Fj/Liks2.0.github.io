import 'dart:io';

void main() {
  print("Programa para calcular gastos de Juanito Import SAC en la feria");
  print("---------------------------------------------------------------");

  // Obtener el monto total a invertir
  stdout.write("Ingrese el monto total de dinero a invertir: ");
  String? inputTotal = stdin.readLineSync();
  double totalInvestment = double.parse(inputTotal!);

  // Calcular gastos para cada rubro
  double rentalSpace = totalInvestment * 0.23;
  double advertising = totalInvestment * 0.07;
  double transportation = totalInvestment * 0.26;
  double fairServices = totalInvestment * 0.12;
  double decoration = totalInvestment * 0.21;
  double miscellaneousExpenses = totalInvestment * 0.11;

  // Mostrar los resultados
  print("\nResultados:");
  print("------------");
  print("Alquiler de espacio en la feria: \$${rentalSpace.toStringAsFixed(2)}");
  print("Publicidad: \$${advertising.toStringAsFixed(2)}");
  print("Transporte: \$${transportation.toStringAsFixed(2)}");
  print("Servicios feriales: \$${fairServices.toStringAsFixed(2)}");
  print("Decoración: \$${decoration.toStringAsFixed(2)}");
  print("Gastos varios: \$${miscellaneousExpenses.toStringAsFixed(2)}");
  print("Total: \$${totalInvestment.toStringAsFixed(2)}");
}
