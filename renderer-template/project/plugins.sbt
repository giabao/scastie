resolvers += Resolver.url("olegych-repo", url("https://bitbucket.org/olegych/mvn/raw/default/ivy2/"))(Resolver.ivyStylePatterns)

addSbtPlugin("com.typesafe.sbt" % "sbt-scalariform" % "1.0.1")

libraryDependencies += "org.scalariform" %% "scalariform" % "0.1.5-SCASTIE"