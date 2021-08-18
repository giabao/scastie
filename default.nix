let
  pkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-21.05.tar.gz") {};
  stdenv = pkgs.stdenv;
  sbt = pkgs.callPackage sbt.nix { };
  jdk = pkgs.adoptopenjdk-hotspot-bin-16;
  fetchurl = pkgs.fetchurl;
in rec {
  scastie = stdenv.mkDerivation rec {
    SBT_OPTS = "-Xms512m -Xmx1024M";
    name = "sbt-env";
    shellHook = ''
    alias cls=clear
    '';
    buildInputs = [
      jdk
      sbt
      pkgs.nodejs
      pkgs.yarn
      pkgs.bash
    ];
  };

  sbt = stdenv.mkDerivation rec {
    name = "sbt-${version}";
    version = "1.5.5";
 
    src = fetchurl {
      url = "https://github.com/sbt/sbt/releases/download/v${version}/sbt-${version}.tgz";
      sha256 = "c0fcd50cf5c91ed27ad01c5c6a8717b62700c87a50ff9b0e7573b227acb2b3c9";
      name = "sbt.tgz";
    };

    patchPhase = ''
      echo -java-home ${jdk.home} >>conf/sbtopts
    '';

    installPhase = ''
      mkdir -p $out/share/sbt $out/bin
      cp -ra . $out/share/sbt
      ln -s $out/share/sbt/bin/sbt $out/bin/
    '';

    meta = with pkgs.lib; {
      homepage = http://www.scala-sbt.org/;
      license = licenses.bsd3;
      description = "A build tool for Scala, Java and more";
      maintainers = with maintainers; [ rickynils ];
      platforms = platforms.unix;
    };
  };

}