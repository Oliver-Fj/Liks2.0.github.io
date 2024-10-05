import 'dart:io';

void main() {
  print("Programa para calcular sueldos de vendedores");
  print("----------------------------------------------");

  // Obtener importe total vendido
  stdout.write("Ingrese el importe total vendido: ");
  String? inputSold = stdin.readLineSync();
  double sold = double.parse(inputSold!);

  // Obtener número de hijos
  stdout.write("Ingrese el número de hijos: ");
  String? inputChildren = stdin.readLineSync();
  int children = int.parse(inputChildren!);

  // Calcular sueldo básico
  double basicSalary = 600;

  // Calcular comisión
  double commission;
  if (sold > 15000) {
    commission = sold * 0.07;
  } else {
    commission = sold * 0.05;
  }

  // Calcular bonificación
  double bonus;
  if (children <= 5) {
    bonus = children * 25;
  } else {
    bonus = children * 22;
  }

  // Calcular sueldo bruto
  double grossSalary = basicSalary + commission + bonus;

  // Calcular descuento
  double discount;
  if (grossSalary > 3500) {
    discount = grossSalary * 0.15;
  } else {
    discount = grossSalary * 0.11;
  }

  // Calcular sueldo neto
  double netSalary = grossSalary - discount;

  // Mostrar resultados
  print("\nResultados:");
  print("------------");
  print("Sueldo básico: S/. ${basicSalary.toStringAsFixed(2)}");
  print("Comisión: S/. ${commission.toStringAsFixed(2)}");
  print("Bonificación: S/. ${bonus.toStringAsFixed(2)}");
  print("Sueldo bruto: S/. ${grossSalary.toStringAsFixed(2)}");
  print("Descuento: S/. ${discount.toStringAsFixed(2)}");
  print("Sueldo neto: S/. ${netSalary.toStringAsFixed(2)}");
}
