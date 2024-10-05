import 'dart:io';

void main() {
  print("Programa para distribuir dinero entre 5 hijos");
  print("---------------------------------------------");

  // Obtener la cantidad total a repartir
  stdout.write("Ingrese la cantidad total de dinero a repartir: ");
  String? inputTotal = stdin.readLineSync();
  double totalAmount = double.parse(inputTotal!);

  // Calcular la parte de Josué
  double josueShare = totalAmount * 0.27;

  // Calcular la parte de Tamar
  double tamarShare = josueShare * 0.85;

  // Calcular la parte de Daniel
  double danielShare = totalAmount * 0.25;

  // Calcular la parte de Caleb
  double calebShare = (josueShare + danielShare) * 0.23;

  // Calcular la parte de David
  double davidShare = totalAmount - (josueShare + tamarShare + danielShare + calebShare);

  // Mostrar los resultados
  print("\nResultados:");
  print("------------");
  print("Josué: \$${josueShare.toStringAsFixed(2)}");
  print("Tamar: \$${tamarShare.toStringAsFixed(2)}");
  print("Caleb: \$${calebShare.toStringAsFixed(2)}");
  print("Daniel: \$${danielShare.toStringAsFixed(2)}");
  print("David: \$${davidShare.toStringAsFixed(2)}");
  print("Total: \$${totalAmount.toStringAsFixed(2)}");
}
