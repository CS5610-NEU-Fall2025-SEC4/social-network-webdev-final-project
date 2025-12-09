{
  lib,
  stdenv,
  buildNpmPackage,
  fetchFromGitHub,
  makeWrapper,
  nodejs_22,
}:

buildNpmPackage (finalAttrs: {
  pname = "social-network-webdev-final-project";
  version = "1.0.0";

  src = fetchFromGitHub {
    owner = "CS5610-NEU-Fall2025-SEC4";
    repo = "social-network-webdev-final-project";
    rev = "b349fe4feaa79a3e4baa2356be55dc6435e0d1a1";
    hash = "sha256-MHEj8H2TPnBc9hL7xC8yhbv/rr0uRSB0lqxV/4bPKR0=";
  };

  nodejs = nodejs_22;

  npmDepsHash = "sha256-IFccwy4NHKUG8DJDeiPWIufK6gX986pA8p7JH0Ey88Y=";

  nativeBuildInputs = [ makeWrapper ];

  NEXT_TELEMETRY_DISABLED = "1";

  installPhase = ''
    runHook preInstall

    mkdir -p $out/bin $out/share/${finalAttrs.pname}

    cp -r dist node_modules $out/share/${finalAttrs.pname}/
    cp package.json package-lock.json $out/share/${finalAttrs.pname}/

    makeWrapper ${nodejs_22}/bin/node $out/bin/${finalAttrs.pname} \
      --add-flags "$out/share/${finalAttrs.pname}/dist/main.js" \
      --set NODE_ENV production

    runHook postInstall
  '';

  meta = {
    description = "CS5610 social network backend (NestJS) packaged with Nix";
    homepage = "https://github.com/CS5610-NEU-Fall2025-SEC4/social-network-webdev-final-project";
    license = lib.licenses.mit;
    platforms = lib.platforms.all;
    mainProgram = finalAttrs.pname;
  };
})
