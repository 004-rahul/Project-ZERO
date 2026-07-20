# Project Zero API — multi-stage build (Architecture Bible §34: Docker for all services)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

COPY . .
RUN dotnet restore ProjectZero.sln
RUN dotnet publish src/ProjectZero.Api/ProjectZero.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ProjectZero.Api.dll"]
