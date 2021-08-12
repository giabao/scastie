lazy val apiSbt = SbtShared.sbtApiProject
dependsOn(apiSbt)
libraryDependencies += "com.typesafe" % "config" % "1.4.1"

val _ = sys.props("java.specification.version").stripPrefix("1.").toInt match {
  case v if v < 9 => sys.error("Please build scastie with jdk 9+")
  case _          => // ok
}
