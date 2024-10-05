import 'dart:io';

void main() {
  print("Programa para calcular descuento y precio final de libretas militares");
  print("-----------------------------------------------------------------------------------");

  // Función para calcular descuento y precio final
  void calculatePrice(int age, int benefitLevel) {
    double price;
    double discountPercentage;

    if (age >= 18) {
      price = 350;
      switch (benefitLevel) {
        case 1:
          discountPercentage = 0.40;
          break;
        case 2:
          discountPercentage = 0.30;
          break;
        case 3:
          discountPercentage = 0.15;
          break;
        default:
          discountPercentage = 0;
      }
    } else {
      price = 200;
      switch (benefitLevel) {
        case 1:
          discountPercentage = 0.60;
          break;
        case 2:
          discountPercentage = 0.40;
          break;
        case 3:
          discountPercentage = 0.20;
          break;
        default:
          discountPercentage = 0;
      }
    }

    double discountAmount = price * discountPercentage;
    double finalPrice = price - discountAmount;

    print("\nResultados:");
    print("------------");
    print("Edad: ${age} años");
    print("Nivel de beneficio: ${benefitLevel}");
    print("Descuento: ${discountPercentage*100}%");
    print("Monto de descuento: S/. ${discountAmount.toStringAsFixed(2)}");
    print("Precio final: S/. ${finalPrice.toStringAsFixed(2)}");
  }

  // Obtener edad y nivel de beneficio del usuario
  stdout.write("Ingrese la edad del hombre: ");
  String? inputAge = stdin.readLineSync();
  int age = int.parse(inputAge!);

  stdout.write("Ingrese el nivel de su sistema de beneficio (1, 2 o 3): ");
  String? inputBenefitLevel = stdin.readLineSync();
  int benefitLevel = int.parse(inputBenefitLevel!);

  // Calcular y mostrar resultados
  calculatePrice(age, benefitLevel);
}
