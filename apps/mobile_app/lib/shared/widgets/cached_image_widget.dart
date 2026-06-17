import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

/// A cached network image widget with shimmer-style loading placeholder
/// and a graceful error fallback icon.
///
/// Wraps [CachedNetworkImage] with consistent styling across the app.
class CachedImageWidget extends StatelessWidget {
  final String? imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadius? borderRadius;
  final Widget? placeholder;
  final IconData errorIcon;
  final Color? errorIconColor;
  final double errorIconSize;

  const CachedImageWidget({
    super.key,
    required this.imageUrl,
    this.width,
    this.height,
    this.fit          = BoxFit.cover,
    this.borderRadius,
    this.placeholder,
    this.errorIcon      = Icons.image_not_supported_outlined,
    this.errorIconColor,
    this.errorIconSize  = 32,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    Widget child;

    if (imageUrl == null || imageUrl!.isEmpty) {
      child = _errorWidget(context);
    } else {
      child = CachedNetworkImage(
        imageUrl:       imageUrl!,
        width:          width,
        height:         height,
        fit:            fit,
        placeholder:    (_, __) =>
            placeholder ?? _loadingWidget(theme),
        errorWidget:    (_, __, ___) => _errorWidget(context),
      );
    }

    if (borderRadius != null) {
      child = ClipRRect(borderRadius: borderRadius!, child: child);
    }

    return child;
  }

  Widget _loadingWidget(ThemeData theme) => Container(
        width:  width,
        height: height,
        color:  theme.colorScheme.surface,
        child:  Center(
          child: SizedBox(
            width:  24,
            height: 24,
            child:  CircularProgressIndicator(
              strokeWidth: 2,
              color:       theme.colorScheme.primary.withOpacity(0.5),
            ),
          ),
        ),
      );

  Widget _errorWidget(BuildContext context) => Container(
        width:  width,
        height: height,
        color:  Theme.of(context).colorScheme.surface,
        child:  Center(
          child: Icon(
            errorIcon,
            size:  errorIconSize,
            color: errorIconColor ??
                Theme.of(context).colorScheme.primary.withOpacity(0.4),
          ),
        ),
      );
}

/// Circular avatar variant of [CachedImageWidget].
class CachedAvatarWidget extends StatelessWidget {
  final String? imageUrl;
  final double  radius;
  final IconData fallbackIcon;

  const CachedAvatarWidget({
    super.key,
    required this.imageUrl,
    this.radius      = 24,
    this.fallbackIcon = Icons.person_rounded,
  });

  @override
  Widget build(BuildContext context) {
    final size = radius * 2;
    return CachedImageWidget(
      imageUrl:      imageUrl,
      width:         size,
      height:        size,
      fit:           BoxFit.cover,
      borderRadius:  BorderRadius.circular(radius),
      errorIcon:     fallbackIcon,
      errorIconSize: radius,
    );
  }
}
