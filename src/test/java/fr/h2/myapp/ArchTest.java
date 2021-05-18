package fr.h2.myapp;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("fr.h2.myapp");

        noClasses()
            .that()
            .resideInAnyPackage("fr.h2.myapp.service..")
            .or()
            .resideInAnyPackage("fr.h2.myapp.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..fr.h2.myapp.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
