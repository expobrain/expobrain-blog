---
class: post-template
comments: true
cover: media/production_data.png
current: post
date: 2023-07-11
layout: post
navigation: true
slug: you-dont-need-production-data
subclass: post
tags:
  - engineering
  - data
title: You don't need production's data
---

There is a prevailing misconception among developers that they need direct access to production data in order to effectively perform their tasks, such as developing new features, fixing bugs, or improving system performance. However, there are compelling reasons why this belief is unfounded.

In this post, we will explore these reasons and shed light on the risks associated with accessing production data.

Additionally, we will discuss viable alternatives for simulating realistic data in test environments.

## Reasons

Let's examine the common reasons that drive developers to believe they need access to production data, and explore alternative solutions.

- **testing the implementation of happy and unhappy paths**: real production data is unnecessary for this purpose; by inserting fake data that replicates the desired scenarios in a staging environment, developers can effectively test the implementation.
- **working on data quality**: errors related to data quality can be addressed without accessing production data; utilizing [defensive programming](https://en.wikipedia.org/wiki/Defensive_programming) techniques, comprehensive validation and checks, as well as good data modeling and proper logging, can help identify and resolve data quality issues without requiring direct access to production data.
- **improving the performance of the system**: enhancing system performance does not necessitate access to real production data; by replicating the data volume and load conditions in a staging environment and leveraging monitoring tools, developers can identify performance bottlenecks and design and test suitable solutions.

These reasons demonstrate that access to production data is not indispensable for developers to perform their tasks effectively. While there may be additional reasons, the ones mentioned above are the most common.

Additionally, it is crucial to consider the risks associated with accessing production data.

## Risks of Accessing Production Data

The risks associated with accessing production data are of paramount importance and can have a profound impact on a company and its customers. Production data is a critical asset that requires meticulous protection. Mishandling this data can lead to devastating consequences for both the company and its customers.

### Data leakage

Replicating production data in a staging environment can create significant risks of data leakage. Unauthorized access to this replicated data can occur, potentially leading to various harmful actions, such as browsing, copying data onto unprotected devices, theft, selling data to competitors, or public leaks. This scenario is particularly prevalent in industries like finance, where the value of data is high and employees often possess access privileges.

Moreover, staging environments typically have lower levels of security compared to production environments, as they are primarily used for development and testing purposes. By replicating production data in such an environment, the data becomes less protected and more vulnerable to potential attacks.

To provide perspective, it is essential to note that mishandling or leaking customer data under the General Data Protection Regulation (GDPR) [could result in a fine of up to €20 million, or 4% of the firm’s worldwide annual revenue from the preceding financial year, whichever amount is higher](https://gdpr.eu/fines). Therefore, safeguarding production data from unauthorized access is crucial to avoid these substantial risks.

### Data protection

Managing and auditing access to production data is a complex and delicate task, encompassing considerations of infrastructure, compliance, and security. The level of effort and risk involved in this process increases exponentially with the number of individuals who have access to this data.

To simplify the management and auditing of data access, it is crucial to limit the number of people with access to production data. By reducing access privileges, it becomes easier, safer, and more transparent to monitor and control data access.

Minimizing the number of individuals with access to production data significantly mitigates the risks associated with unauthorized usage, data breaches, and potential mishandling. It allows for more effective monitoring, enforcement of security measures, and compliance with regulatory requirements.

By adopting [the principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) and implementing robust access controls, organizations can enhance data protection, reduce the potential for errors or misuse, and streamline the management and auditability of production data access.

## Simulating Realistic Data in Test Systems

Now that we understand the importance of avoiding direct access to production data, the question arises: How can we simulate realistic data at scale in our test systems?

Fortunately, there are libraries available in major programming languages that specialize in generating realistic but entirely fake data, indistinguishable from real data.

For instance, in Python, there's the [Faker](https://pypi.org/project/Faker/) library. It provides support for generating various types of data such as names, addresses, phone numbers, and more. Faker also offers multi-language and locale support, enabling the generation of diverse data sets.

Additionally, there's [Factory Boy](https://pypi.org/project/factory-boy/), which builds upon the concept of Faker and provides a framework for generating fake data from your database models. It streamlines the integration of these libraries into your test suites, reducing friction and simplifying the process of generating simulated data.

These libraries are more than capable of simulating realistic data, not only for testing happy/unhappy paths and data quality but also for generating large volumes of data for performance testing. They offer the flexibility to generate virtually unlimited amounts of data to suit your testing needs.

By leveraging these powerful tools, developers can confidently simulate realistic data in their test environments without the need to access production data. This approach ensures data privacy and security while still enabling comprehensive and robust testing scenarios.

## Conclusion

In conclusion, it is crucial to limit access to production data as much as possible, ideally to zero. The costs and risks associated with managing and auditing data access are too high to justify widespread access. Thankfully, there are safer and simpler alternatives available for simulating production data in test environments, reducing the complexity and effort required to generate realistic data for testing purposes.

By following the principle of limited access to production data and utilizing effective data simulation techniques, developers can strike a balance between comprehensive testing and safeguarding the company's most valuable asset. Prioritizing data privacy and security is essential, considering the potential consequences of mishandling or unauthorized access to production data.

In summary, organizations should prioritize the protection of production data and adopt alternative approaches to simulate data in test environments. By doing so, they can minimize risks, reduce costs, and simplify the process of generating realistic test data.
