package com.webkorps.platform.identity.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "employee_profiles")
@Getter
@Setter
@NoArgsConstructor
public class EmployeeProfile {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true,
            foreignKey = @ForeignKey(name = "fk_employee_profiles_user")
    )
    private User user;

    @Column(name = "employee_code", unique = true, length = 50)
    private String employeeCode;

    @Column(length = 100)
    private String department;

    @Column(name = "job_title", length = 100)
    private String jobTitle;



}
