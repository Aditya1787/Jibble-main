import 'package:flutter/material.dart';
import 'package:jibble_mobile/core/theme/app_colors.dart';

class NeumorphicBox extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final bool isRecessed;
  final BoxShape shape;
  final Color? color;

  const NeumorphicBox({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.margin,
    this.borderRadius = 20.0,
    this.isRecessed = false,
    this.shape = BoxShape.rectangle,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final baseColor = color ?? AppColors.background;

    // Soft shadows adapted for #f3efe8 base background
    final List<BoxShadow> shadows = isRecessed
        ? [
            // Recessed (concave inset feeling): dark shadow inside top-left, white border highlights bottom-right
            BoxShadow(
              color: const Color(0xFFDDD8CE),
              offset: const Offset(2, 2),
              blurRadius: 3,
              spreadRadius: 1,
            ),
            const BoxShadow(
              color: Colors.white,
              offset: Offset(-2, -2),
              blurRadius: 3,
            ),
          ]
        : [
            // Extruded (convex elevated feeling): white glow top-left, soft grey shadow bottom-right
            const BoxShadow(
              color: Colors.white,
              offset: Offset(-8, -8),
              blurRadius: 16,
            ),
            const BoxShadow(
              color: Color(0xFFD2CDC3),
              offset: Offset(8, 8),
              blurRadius: 16,
            ),
          ];

    final double activeRadius = shape == BoxShape.circle ? 0.0 : borderRadius;

    return Container(
      margin: margin,
      padding: padding,
      decoration: BoxDecoration(
        color: isRecessed ? const Color(0xFFEBE6DD) : baseColor,
        shape: shape,
        borderRadius: shape == BoxShape.rectangle
            ? BorderRadius.circular(activeRadius)
            : null,
        border: isRecessed
            ? Border.all(color: const Color(0xFFDFD9D0), width: 1.2)
            : Border.all(color: Colors.white.withOpacity(0.4), width: 0.8),
        boxShadow: shadows,
      ),
      child: child,
    );
  }
}
