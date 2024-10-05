import 'dart:io';

void main() {
  print("Programa para calcular rebaja y nueva pensión universitaria");
  print("---------------------------------------------------------");

  // Obtener categoría del estudiante
  stdout.write("Ingrese la categoría del estudiante (A, B, C o D): ");
  String? categoryInput = stdin.readLineSync();
  
  // Validar entrada de categoría
  String category;
  while (categoryInput == null || !['A', 'B', 'C', 'D'].contains(categoryInput.toUpperCase())) {
    stdout.write("Entrada inválida. Por favor, ingrese una categoría válida (A, B, C o D): ");
    categoryInput = stdin.readLineSync();
  }
  category = categoryInput.toUpperCase();

  // Obtener nota promedio
  stdout.write("Ingrese el promedio ponderado del ciclo anterior: ");
  String? inputAverage = stdin.readLineSync();
  double average = double.parse(inputAverage!);

  // Definir pensiones según categoría
  Map<String, double> pensions = {
    'A': 550,
    'B': 500,
    'C': 460,
    'D': 400
  };

  // Calcular descuento según nota promedio
  double discountPercentage;
  if (average < 14) {
    discountPercentage = 0;
  } else if (average < 16) {
    discountPercentage = 0.10;
  } else if (average < 18) {
    discountPercentage = 0.12;
  } else {
    discountPercentage = 0.15;
  }

  // Calcular descuento y nueva pensión
  double currentPension = pensions[category]!;
  double discountAmount = currentPension * discountPercentage;
  double newPension = currentPension - discountAmount;

  // Mostrar resultados
  print("\nResultados:");
  print("------------");
  print("Categoría: $category");
  print("Nota promedio: $average");
  print("Descuento: ${discountPercentage*100}%");
  print("Monto de descuento: S/. ${discountAmount.toStringAsFixed(2)}");
  print("Nueva pensión: S/. ${newPension.toStringAsFixed(2)}");
}
